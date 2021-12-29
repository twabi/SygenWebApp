import React, {useEffect, useState} from 'react'
import {Card, Layout} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {Text} from "react-font";
import {
    Dialog, Button,
    EditIcon,
    EyeOpenIcon,
    SearchInput,
    TrashIcon
} from "evergreen-ui";
import {
    MDBAlert,
    MDBCol, MDBListGroup, MDBListGroupItem,
    MDBRow
} from "mdbreact";
import {Alert} from 'antd';
import {useListVals} from "react-firebase-hooks/database";
import Firebase from "../Firebase";
import CreateProjectModal from "../Modals/Projects/CreateProjectModal";


const { Content } = Layout;
const moment = require("moment");
const dbRef = Firebase.database().ref('System/Projects');
const Projects = () => {

    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [projects, loading, error] = useListVals(dbRef);
    const [dataArray, setDataArray] = useState([]);
    const [createModal, setCreateModal] = useState(false);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }

    const handleSearch  = searchText => {
    }

    useEffect(() => {
        if(projects){
            setDataArray([...projects]);
        }

        if(error){
            setMessage("Unable to show projects occurred :: " + error.message);
            setColor("danger");
            setShowAlert(true);
        }
    }, [projects, loading, error])

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
                                    isShown={createModal}
                                    title="Create New Project"
                                    onCloseComplete={() => {setCreateModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateProjectModal modal={setCreateModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Projects
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search projects" className="w-100"
                                                             onChange={e => handleSearch(e.target.value)} />
                                                <Button height={40} appearance="primary"
                                                        style={{background: "#f06000", borderColor: "#f06000", color: "#fff"}}
                                                        className="mx-2" onClick={() => {setCreateModal(true)}}>
                                                    New Project
                                                </Button>
                                            </MDBRow>
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
                                        <>

                                            <MDBRow>
                                                <MDBCol>

                                                        <div >
                                                            <MDBListGroup>
                                                                {loading ?
                                                                    <div className="d-flex justify-content-center">
                                                                        <div className="spinner-border mx-4 my-4 indigo-text spinner-border" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </div> : null}

                                                                {dataArray.map((project, index) => (
                                                                    <MDBListGroupItem key={index}
                                                                                      className="my-1 border-top border-dark">
                                                                        <div className="d-flex w-100 my-2 justify-content-between">
                                                                            <div className="d-flex flex-column mt-2">
                                                                                <h6 className="mb-1 font-weight-bolder">{String(project.name).toUpperCase()}</h6>
                                                                                <small className="font-italic font-weight-bolder">
                                                                                    {project.description}
                                                                                </small>
                                                                            </div>

                                                                            <small className="font-italic font-weight-bolder">
                                                                                {moment(project.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}
                                                                            </small>
                                                                        </div>
                                                                        <MDBRow>
                                                                            <MDBCol>
                                                                                <Alert className="w-100 my-1 deep-orange-text"
                                                                                       style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}}
                                                                                       message={<>Period: <b>{moment(project.startDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY") + " - " +
                                                                                moment(project.endDate, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>}/>

                                                                                <Alert message={<>Status: <b>{project.status}</b></>} className="w-100 my-1 deep-orange-text"
                                                                                       style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />

                                                                                <Alert message={<>Type: <b>{project.type}</b></>} className="w-100 my-1 deep-orange-text"
                                                                                       style={{borderColor: "#ff6905", backgroundColor:"#ffdec9", color:"#ff6905"}} />
                                                                            </MDBCol>
                                                                            <MDBCol md={2}>
                                                                                <div className="d-flex flex-column mt-2">
                                                                                    <Button className="my-1" type="danger" onClick={() => {
                                                                                    }}>
                                                                                        <EyeOpenIcon/>
                                                                                    </Button>
                                                                                    <Button type="primary" className="my-1" onClick={() => {

                                                                                    }}>
                                                                                        <EditIcon color="info"/>
                                                                                    </Button>
                                                                                    <Button className="my-1" type="danger" onClick={() => {
                                                                                        // eslint-disable-next-line no-restricted-globals

                                                                                    }}>
                                                                                        <TrashIcon color="danger"/>
                                                                                    </Button>
                                                                                </div>

                                                                            </MDBCol>
                                                                        </MDBRow>


                                                                    </MDBListGroupItem>

                                                                ))}
                                                            </MDBListGroup>
                                                        </div>
                                                </MDBCol>

                                            </MDBRow>
                                        </>
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

export default Projects;
