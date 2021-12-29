import React, {useEffect, useState} from 'react'
import {Alert, Avatar, Card, Layout, List, Progress, Skeleton, Space} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBAlert, MDBBox, MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {useParams} from "react-router";
import {useListVals, useObject} from "react-firebase-hooks/database";
import Firebase from "../Firebase";
import {AddIcon, Badge, Button, Dialog, EditIcon, TrashIcon} from "evergreen-ui";
import {deleteProject, showEditModal} from "./Projects";
import EditProjectModal from "../Modals/Projects/EditProjectModal";
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import CreateTaskModal from "../Modals/Tasks/CreateTaskModal";
import EditTaskModal from "../Modals/Tasks/EditTaskModal";
import {deleteTask, handleEdit} from "./Tasks";


const { Content } = Layout;
const moment = require('moment');
var now = moment();
const userRef = Firebase.database().ref('System/Users');
const taskRef = Firebase.database().ref('System/Tasks');
const ProjectDetails = () => {

    const { id } = useParams();
    const ref = 'System/Projects/' + id;
    const dbRef = Firebase.database().ref(ref);
    const [snapshot, loading, error] = useObject(dbRef);
    const [checkedData, setCheckedData] = useState(true);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [projectDet, setProjectDet] = useState(null);
    const [users] = useListVals(userRef);
    const [tasks, taskLoading] = useListVals(taskRef);
    const [taskArray, setTaskArray] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editTaskModal, setEditTaskModal] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const callback = (data) => {
        setCheckedData(data);
    }

    useEffect(() => {
        //console.log(id)
        if(snapshot){
            setProjectDet(snapshot.val());
        }
        
        if(error){
            setMessage("Unable to show project Details occurred :: " + error.message);
            setColor("danger");
            setShowAlert(true);   
        }
        
        if(tasks){
            setTaskArray(tasks.filter(x => x.projectID === id));
        }
        
    }, [error, id, snapshot, tasks])

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <>
            <Layout style={{width: "100vw"}}>
                <SideBar checked={checkedData}/>
                <Layout className="site-layout">
                    <NavBar token={"token"} checkBack={callback}/>
                    <Content
                        className="site-layout-background"
                        style={{ margin: '9px 14px 15px'}}
                    >
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
                            isShown={editTaskModal}
                            title="Edit Task"
                            onCloseComplete={() => {setEditTaskModal(false)}}
                            shouldCloseOnOverlayClick={false}
                            hasFooter={false}>

                            <MDBCol md={12}>
                                <EditTaskModal modal={setEditTaskModal} selectedTask={selectedTask}/>
                            </MDBCol>

                        </Dialog>

                        <Dialog
                            isShown={editModal}
                            title="Edit Project"
                            onCloseComplete={() => {setEditModal(false)}}
                            shouldCloseOnOverlayClick={false}
                            hasFooter={false}>

                            <MDBCol md={12}>
                                <EditProjectModal editProject={editProject} modal={setEditModal}/>
                            </MDBCol>

                        </Dialog>

                        <div className="p-2">
                            {showAlert?
                                <>
                                    <MDBAlert color={color} className="my-3 font-italic" >
                                        {message}
                                    </MDBAlert>
                                </>
                                : null }
                            <>
                                <MDBRow>

                                    <MDBCol md={7}>
                                        <Card className="mt-2 w-100">
                                            <MDBRow>
                                                <MDBCol md={9}>
                                                    <div className="d-block ml-1">
                                                        <h3 className="font-weight-bold">
                                                            <Text family='Nunito'>
                                                                {projectDet&&projectDet.name}
                                                            </Text>
                                                        </h3>
                                                    </div>
                                                    {loading ?
                                                    <div className="d-flex justify-content-center">
                                                        <div className="spinner-border mx-4 my-4 deep-orange-text spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div> : null}
                                                </MDBCol>
                                                <MDBCol>
                                                    <Button type="primary" className="mx-1" onClick={() => {
                                                        showEditModal(projectDet, setEditProject, setEditModal);
                                                    }}>
                                                        <EditIcon color="info"/>
                                                    </Button>
                                                    <Button className="mx-1" type="danger" onClick={() => {
                                                        // eslint-disable-next-line no-restricted-globals
                                                        if (confirm("Are you sure you want to delete project?")) {
                                                            deleteProject(projectDet.projectID, setMessage, setColor, setShowAlert);
                                                        }

                                                    }}>
                                                        <TrashIcon color="danger"/>
                                                    </Button>
                                                </MDBCol>

                                            </MDBRow>
                                            <hr/>
                                            <MDBRow left>
                                                <Card bordered={false} className="w-100 bg-white">
                                                    <div>
                                                        <Alert message={<>Description: &nbsp;&nbsp;<b>{projectDet&&projectDet.description}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Status: &nbsp;&nbsp;<b>{projectDet&&projectDet.status}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Period: &nbsp;&nbsp;<b>{moment(projectDet&&projectDet.startDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY") + " - " +
                                                            moment(projectDet&&projectDet.endDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>}
                                                               className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Type: &nbsp;&nbsp;<b>{projectDet&&projectDet.type}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Payment type: &nbsp;&nbsp;<b>{projectDet&&projectDet.paymentType}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Payment Amount: &nbsp;&nbsp;<b>K{projectDet&&numberWithCommas(projectDet.amount)}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Created By: &nbsp;&nbsp;<b>{
                                                            projectDet&&
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)]&&
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)].firstname + " " +
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)].surname
                                                        }</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Date Created: &nbsp;&nbsp;<b>{moment(projectDet&&projectDet.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                    </div>
                                                </Card>

                                            </MDBRow>

                                        </Card>

                                    </MDBCol>

                                    <MDBCol>
                                        <Card className="mt-2 w-100">
                                            <MDBRow>
                                                <MDBCol md={9}>
                                                    <div className="d-block ml-1">
                                                        <h3 className="font-weight-bold">
                                                            <Text family='Nunito'>
                                                                Project Tasks
                                                            </Text>
                                                        </h3>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol>
                                                    <Button type="primary" className="mx-1" onClick={() => {setShowModal(true)}}>
                                                        <AddIcon color="info"/>
                                                    </Button>
                                                </MDBCol>

                                            </MDBRow>
                                            <hr/>
                                            <MDBRow>
                                                <Card bordered={false} className="w-100 bg-white scroll">
                                                    <List
                                                        loading={taskLoading}
                                                        itemLayout="vertical"
                                                        dataSource={taskArray}
                                                        renderItem={item => (
                                                            <List.Item
                                                                key={item.title}
                                                                actions={[
                                                                    <Badge color={item.taskStatus === "Complete" ? "green" : "neutral"}>{item.taskStatus}</Badge>,
                                                                    <Badge color={now.isBefore(moment(item.deadline, "YYYY-MM-DDTh:mm").format("DD MMM YYYY")) ? "green" : "neutral"}>
                                                                        {moment(item.deadline, "YYYY-MM-DDTh:mm").format("DD MMM YYYY")}</Badge>,
                                                                    <EditIcon onClick={ () => {handleEdit(item, setSelectedTask, setEditTaskModal)}} color="info"/>,
                                                                    <TrashIcon color="danger" onClick={() => {
                                                                        // eslint-disable-next-line no-restricted-globals
                                                                        if (confirm("Are you sure you want to delete Task?")) {
                                                                            deleteTask(item.taskID, setColor, setShowAlert, setMessage);
                                                                        }
                                                                    }
                                                                    }/>
                                                                ]}
                                                            >
                                                                <List.Item.Meta
                                                                    avatar={<Avatar className="float-left d-inline"
                                                                                    style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size="small" gap={1}>T</Avatar>}
                                                                    title={<a href="">{item.title}</a>}
                                                                    description={item.description}
                                                                />
                                                                <div>
                                                                    <div className="d-flex flex-row">
                                                                        Assigned To: &nbsp;&nbsp; {item&&item.assignedTo.map((userid) => (
                                                                            <>
                                                                                <b className="d-inline">{users[users.findIndex(x => (x.userID) === userid)] &&
                                                                                users[users.findIndex(x => (x.userID) === userid)].firstname + " " +
                                                                                users[users.findIndex(x => (x.userID) === userid)].surname}</b>,&nbsp;
                                                                            </>

                                                                    ))}
                                                                    </div>
                                                                </div>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>

                                            </MDBRow>

                                        </Card>
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow>
                                    <MDBCol>
                                        <Card className="mt-2 w-100">
                                            <MDBRow>
                                                <MDBCol md={9}>
                                                    <div className="d-block ml-1">
                                                        <h3 className="font-weight-bold">
                                                            <Text family='Nunito'>
                                                                Members Assigned
                                                            </Text>
                                                        </h3>
                                                    </div>
                                                </MDBCol>

                                            </MDBRow>
                                            <hr/>
                                            <MDBRow>
                                                <Card bordered={false} className="w-100 bg-white">
                                                </Card>

                                            </MDBRow>

                                        </Card>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol md={12}>
                                        <Card className="mt-2 w-100">
                                            <MDBRow>
                                                <MDBCol>
                                                    <div className="d-block ml-1">
                                                        <h3 className="font-weight-bold">
                                                            <Text family='Nunito'>
                                                                Gantt Chart
                                                            </Text>
                                                        </h3>
                                                    </div>
                                                    {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                </MDBCol>

                                            </MDBRow>
                                            <hr/>
                                            <MDBRow>
                                                <Card bordered={false} className="w-100 bg-white">
                                                </Card>

                                            </MDBRow>

                                        </Card>

                                    </MDBCol>
                                </MDBRow>

                            </>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default ProjectDetails;
