import React, {useEffect, useState} from 'react'
import {Card, Layout, Progress} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBAlert, MDBBox, MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {useParams} from "react-router";
import {useObject} from "react-firebase-hooks/database";
import Firebase from "../Firebase";
import {AddIcon, Button, EditIcon, TrashIcon} from "evergreen-ui";


const { Content } = Layout;

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
                                    {loading ?
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border mx-4 my-4 deep-orange-text spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div> : null}
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
                                                </MDBCol>
                                                <MDBCol>
                                                    <Button type="primary" className="mx-1" onClick={() => {
                                                        //showEditModal(project);
                                                    }}>
                                                        <EditIcon color="info"/>
                                                    </Button>
                                                    <Button className="mx-1" type="danger" onClick={() => {
                                                        // eslint-disable-next-line no-restricted-globals
                                                        if (confirm("Are you sure you want to delete outlet?")) {
                                                            //deleteProject(project.projectID);
                                                        }

                                                    }}>
                                                        <TrashIcon color="danger"/>
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
