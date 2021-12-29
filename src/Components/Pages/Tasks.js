import React, {useEffect, useState} from 'react'
import {Card, Layout, Table} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {
    Badge,
    Dialog,
    Button,
    SearchInput, EyeOpenIcon, TrashIcon, EditIcon,
} from "evergreen-ui";
import {MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBtn} from "mdbreact";
import {
    MDBAlert,
    MDBCol,
    MDBRow,
} from "mdbreact";
import {Text} from "react-font";
import { useListVals } from 'react-firebase-hooks/database';
import Firebase from "../Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import CreateTaskModal from "../Modals/Tasks/CreateTaskModal";
import FireFetch from "../FireFetch";
import EditTaskModal from "../Modals/Tasks/EditTaskModal";
import ViewTaskModal from "../Modals/Tasks/ViewTaskModal";

const { Content } = Layout;
const outletsRef = Firebase.database().ref('System/Outlets');
const usersRef = Firebase.database().ref('System/Users');
const taskRef = Firebase.database().ref('System/Tasks');
var storageRef = Firebase.storage().ref("System/Tasks");
const moment = require("moment");

const Tasks = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Task Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Assigned To',
            dataIndex: 'assigned',
            key: 'assigned',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];


    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }
    const [outlets] = useListVals(outletsRef);
    const [users] = useListVals(usersRef);
    const [tasks, loading] = useListVals(taskRef);
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [taskArray, setTaskArray] = useState([]);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("Filter Status");
    const [selectedTask, setSelectedTask] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);


    useEffect(() => {
        if(loggedInUser){

            if(tasks){
                var tempArray = [];
                tasks.map((task, index) => {

                    if(task.taskStatus === "Complete" && task.taskType === "Brand Coverage"){
                        var urlArray = []
                        storageRef.child(task.taskID).listAll()
                            .then((res) => {
                                res.items.forEach((itemRef) => {
                                    // All the items under listRef.
                                    itemRef.getDownloadURL().then((url) => {
                                        urlArray.push(url);
                                    })
                                });
                            }).catch((error) => {
                            // Uh-oh, an error occurred!
                        });
                        task.urls = urlArray;
                    }

                    var payload = {
                        "uid": task.createdByID
                    }
                    var url = "https://us-central1-sales265-d18df.cloudfunctions.net/getUserDetails";
                    fetch(url,
                        {
                            method : 'POST',
                            body : JSON.stringify(payload),
                            headers: {
                                'Content-type': 'application/json',
                            },
                        })
                        .then(response => response.json())
                        .then((result) => {
                            task.createdByID = result.email;
                        })
                        .catch((error) => {
                            console.log('error', error)
                        });

                    var now = moment();
                    var deadline = moment(task.deadline, "YYYY-MM-DDTh:mm").format("DD MMM YYYY");

                    tempArray.push({
                        key: index + 1,
                        type: task.taskType,
                        status: <Badge color={task.taskStatus === "Complete" ? "green" : "neutral"}>{task.taskStatus}</Badge>,
                        assigned: users[users.findIndex(x => (x.userID) === task.assignedUser)]&&
                            users[users.findIndex(x => (x.userID) === task.assignedUser)].firstname + " " +
                            users[users.findIndex(x => (x.userID) === task.assignedUser)].surname,
                        deadline : <Badge color={now.isBefore(deadline) ? "green" : "neutral"}>{deadline}</Badge>,
                        location: task.taskType === "Brand Coverage" ? task.location :
                            outlets[outlets.findIndex(x => (x.outletID) === task.assignedOutlet)]&&
                            outlets[outlets.findIndex(x => (x.outletID) === task.assignedOutlet)].name,
                        action: <div>
                            <Button intent="primary" onClick={() => {
                                setSelectedTask(task);
                                setViewModal(true);
                            }}>
                                <EyeOpenIcon color="blue700"/>
                            </Button>
                            <Button intent="danger" onClick={() => {
                                // eslint-disable-next-line no-restricted-globals
                                if (confirm("Are you sure you want to delete Task?")) {
                                    deleteTask(task.taskID);
                                }
                            }}>
                                <TrashIcon color="danger"/>
                            </Button>
                            <Button intent="edit" onClick={() => {
                                setSelectedTask(task);
                                setEditModal(true);
                            }}>
                                <EditIcon color="primary"/>
                            </Button></div>
                    });
                });

                setDataArray([...tempArray]);
                setTaskArray([...tempArray]);
            }
        } else {
            //window.location.href = "/login";
        }

    }, [loggedInUser, outlets, tasks, users])


    const handleSearch = searchText => {
        const filteredEvents = taskArray.filter(({ assigned, type, location }) => {
            assigned = assigned.toLowerCase();
            type = type.toLowerCase();
            location = location.toLowerCase();
            return assigned.includes(searchText) || type.includes(searchText) || location.includes(searchText);
        });

        setDataArray(filteredEvents);
    };

    const handleFilter = (option) => {
        let filteredEvents;
        if(option === "All"){
            filteredEvents = taskArray;
        } else {
            filteredEvents = taskArray.filter(({ status }) => {
                status = status.props.children;
                return status.includes(option);
            });
        }
        setDataArray(filteredEvents);
    }


    const deleteTask = (taskID) => {
        const output = FireFetch.DeleteFromDB("Tasks", taskID);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Task deleted successfully");
                setColor("success");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
            }
        })
            .catch((error) => {
                setMessage("Unable to delete task occurred :: " + error.message);
                setColor("danger");
                setShowAlert(true);
            });
    }

    return (
        <>
            <Layout style={{width: "100vw"}}>
                <SideBar checked={checkedData}/>
                <Layout className="site-layout">
                    <NavBar token={"token"} checkBack={callback}/>
                    <Content
                        className="site-layout-background"
                        style={{ margin: '10px 16px 15px'}}
                    >

                        <MDBRow className="w-100">
                            <MDBCol md={12}>

                                <Dialog
                                    isShown={showModal}
                                    title="Create New Task"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateTaskModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={editModal}
                                    title="Edit Task"
                                    onCloseComplete={() => {setEditModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <EditTaskModal modal={setEditModal} selectedTask={selectedTask}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={viewModal}
                                    title="View Task"
                                    onCloseComplete={() => {setViewModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>
                                    <MDBCol md={12}>
                                        <ViewTaskModal modal={setViewModal} selectedTask={selectedTask}/>
                                    </MDBCol>

                                </Dialog>

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left">
                                                <div className="d-block">
                                                    <h5 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Tasks
                                                        </Text>
                                                    </h5>
                                                </div>
                                            </div>

                                            <div className="ml-1 d-flex flex-row align-items-center w-100">
                                                <SearchInput height={40} placeholder="Search tasks(type, location, user)" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <MDBDropdown>
                                                    <MDBDropdownToggle caret color="primary">
                                                        {filter}
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu>
                                                        {["All","Incomplete", "Complete", "Pending Further Info"].map((item, index) => (
                                                            <MDBDropdownItem onClick={() => {handleFilter(item); setFilter(item);}} key={index}>{item}</MDBDropdownItem>
                                                        ))}
                                                    </MDBDropdownMenu>
                                                </MDBDropdown>


                                                <MDBBtn  color="indigo" className="ml-1 text-white" onClick={() => {setShowModal(true)}}>
                                                    New Task
                                                </MDBBtn>
                                            </div>
                                        </MDBCol>

                                    </MDBRow>

                                </Card>

                                <Card>
                                    {showAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3 font-italic" >
                                                {message}
                                            </MDBAlert>
                                        </>
                                        : null }
                                    <Card className="d-flex flex-column">
                                        <div>
                                            <Table style={{overflow: "auto"}} id={"dataTable"} loading={loading} dataSource={dataArray} columns={columns} />
                                        </div>
                                    </Card>
                                </Card>

                            </MDBCol>
                        </MDBRow>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default Tasks;
