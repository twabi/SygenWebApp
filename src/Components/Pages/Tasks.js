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
import Firebase from "../Firebase/Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import CreateTaskModal from "../Modals/Tasks/CreateTaskModal";
import FireFetch from "../Firebase/FireFetch";
import EditTaskModal from "../Modals/Tasks/EditTaskModal";
import ViewTaskModal from "../Modals/Tasks/ViewTaskModal";

const { Content } = Layout;
const projRef = Firebase.database().ref('System/Projects');
const usersRef = Firebase.database().ref('System/Users');
const taskRef = Firebase.database().ref('System/Tasks');
const moment = require("moment");

const Tasks = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },{
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },{
            title: 'Project',
            dataIndex: 'project',
            key: 'project',
        },
        {
            title: 'Task Type',
            dataIndex: 'type',
            key: 'type',
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
            title: 'Date assigned',
            dataIndex: 'date',
            key: 'date',
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
    const [projects] = useListVals(projRef);
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


                    var now = moment();
                    var deadline = moment(task.deadline, "YYYY-MM-DDTh:mm").format("DD MMM YYYY");
                    var dateAssigned = moment(task.dateCreated, "YYYY-MM-DDTh:mm").format("DD MMM YYYY");
                    var projectName = projects[projects.findIndex(x => (x.projectID) === task.projectID)]&&
                        projects[projects.findIndex(x => (x.projectID) === task.projectID)].name;

                    tempArray.push({
                        key: index + 1,
                        title: task.title,
                        type: task.taskType,
                        project: projectName,
                        status: <Badge color={task.taskStatus === "Complete" ? "green" : "neutral"}>{task.taskStatus}</Badge>,
                        deadline : <Badge color={now.isBefore(deadline) ? "green" : "neutral"}>{deadline}</Badge>,
                        date : dateAssigned,
                        assignedTo : task.assignedTo,
                        action: <div>
                            <Button appearance="default" onClick={() => {
                                setSelectedTask(task);
                                setViewModal(true);
                            }}>
                                <EyeOpenIcon color="blue700"/>
                            </Button>
                            <Button intent="danger" onClick={() => {
                                // eslint-disable-next-line no-restricted-globals
                                if (confirm("Are you sure you want to delete Task?")) {
                                    deleteTask(task.taskID, setColor, setShowAlert, setMessage);
                                }
                            }}>
                                <TrashIcon color="danger"/>
                            </Button>
                            <Button intent="edit" onClick={() => {
                                handleEdit(task, setSelectedTask, setEditModal);
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

    }, [loggedInUser, projects, tasks, users])


    const handleSearch = searchText => {
        const filteredEvents = taskArray.filter(({ title, type, project }) => {
            title = title.toLowerCase();
            type = type.toLowerCase();
            project = project.toLowerCase();
            return title.includes(searchText) || type.includes(searchText) || project.includes(searchText);
        });

        setDataArray(filteredEvents);
    };

    const handleFilter = (option) => {
        let filteredEvents;
        if(option === "All"){
            filteredEvents = taskArray;
        } else if (option === "My Tasks"){
            filteredEvents = taskArray.filter(x => (x.assignedTo).includes(loggedInUser.uid));
        }else {
            filteredEvents = taskArray.filter(({ status }) => {
                status = status.props.children;
                return status.includes(option);
            });
        }
        setDataArray(filteredEvents);
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
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Tasks
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="ml-1 d-flex flex-row align-items-center w-100">
                                                <SearchInput height={40} width={window.innerWidth /4} placeholder="Search tasks(type, project, status)" className="w-100" onChange={e => handleSearch(e.target.value)} />
                                                <Button height={40} appearance="primary"
                                                        style={{background: "#f06000", borderColor: "#f06000", color: "#fff"}}
                                                        className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Task
                                                </Button>
                                                <MDBDropdown>
                                                    <MDBDropdownToggle caret color="white" >
                                                        {filter}
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu>
                                                        {["All","My Tasks", "Incomplete", "Complete", "Pending Further Info"].map((item, index) => (
                                                            <MDBDropdownItem onClick={() => {handleFilter(item); setFilter(item);}} key={index}>{item}</MDBDropdownItem>
                                                        ))}
                                                    </MDBDropdownMenu>
                                                </MDBDropdown>



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

export const handleEdit = (task, setSelectedTask, setEditModal) => {
    setSelectedTask(task);
    setEditModal(true);
}

export const deleteTask = (taskID, setColor, setShowAlert, setMessage) => {
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

export default Tasks;
