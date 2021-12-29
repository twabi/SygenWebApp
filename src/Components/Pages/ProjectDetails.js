import React, {useEffect, useState} from 'react'
import {Alert, Card, Layout, Progress} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBAlert, MDBBox, MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {useParams} from "react-router";
import {useListVals, useObject} from "react-firebase-hooks/database";
import Firebase from "../Firebase";
import {AddIcon, Button, Dialog, EditIcon, TrashIcon} from "evergreen-ui";
import {deleteProject, showEditModal} from "./Projects";
import EditProjectModal from "../Modals/Projects/EditProjectModal";


const { Content } = Layout;
const moment = require('moment');
const userRef = Firebase.database().ref('System/Users');
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
    const [editModal, setEditModal] = useState(false);
    const [editProject, setEditProject] = useState(null);


    const callback = (data) => {
        setCheckedData(data);
    }

    useEffect(() => {
        //console.log(id)
        if(snapshot){
            console.log(snapshot.val());
            setProjectDet(snapshot.val());
        }
        
        if(error){
            setMessage("Unable to show project Details occurred :: " + error.message);
            setColor("danger");
            setShowAlert(true);   
        }
        
    }, [error, id, snapshot])

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

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
                                                        <Alert message={<>Description: <b>{projectDet&&projectDet.description}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Status: <b>{projectDet&&projectDet.status}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Period: <b>{moment(projectDet&&projectDet.startDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY") + " - " +
                                                            moment(projectDet&&projectDet.endDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>}
                                                               className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Type: <b>{projectDet&&projectDet.type}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Payment type: <b>{projectDet&&projectDet.paymentType}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Payment Amount: <b>K{projectDet&&numberWithCommas(projectDet.amount)}</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Created By: <b>{
                                                            projectDet&&
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)]&&
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)].firstname + " " +
                                                            users[users.findIndex(x => (x.userID) === projectDet.createdByID)].surname
                                                        }</b></>} className="w-100 my-1 deep-orange-text"
                                                               style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                        <Alert message={<>Date Created: <b>{moment(projectDet&&projectDet.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>} className="w-100 my-1 deep-orange-text"
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
                                                    <Button type="primary" className="mx-1" onClick={() => {
                                                        //showEditModal(project);
                                                    }}>
                                                        <AddIcon color="info"/>
                                                    </Button>
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
