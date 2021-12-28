import React, {useState} from 'react'
import {Card, Layout} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {Text} from "react-font";
import {
    Button,
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


const { Content } = Layout;
const moment = require("moment");
const dbRef = Firebase.database().ref('System/Projects');
const Projects = () => {

    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [projects, loading, error] = useListVals(dbRef);
    const [dataArray, setDataArray] = useState([]);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }

    const handleSearch  = searchText => {
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

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left">
                                                <div className="d-block">
                                                    <h5 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Projects
                                                        </Text>
                                                    </h5>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search outlets using name or location" className="w-100"
                                                             onChange={e => handleSearch(e.target.value)} />
                                                <Button height={40} appearance="primary" className="mx-2" onClick={() => {}}>
                                                    New Outlet
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

                                                                {dataArray.map((outlet, index) => (
                                                                    <MDBListGroupItem key={index} className="my-1 border-top border-info">
                                                                        <div className="d-flex w-100 my-2 justify-content-between">
                                                                            <h6 className="mb-1 indigo-text">{String(outlet.name).toUpperCase()}</h6>
                                                                            <small className="font-italic">
                                                                                {moment(outlet.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}
                                                                            </small>
                                                                        </div>
                                                                        <Alert message={"Message"} className="w-100 mr-3" type="info" showIcon />
                                                                        <Alert message={"Message"} className="w-100 mr-3" type="success" showIcon />
                                                                        <div className="d-flex flex-row mt-3">
                                                                            <Button className="mr-1" type="danger" onClick={() => {
                                                                            }}>
                                                                                <EyeOpenIcon/>
                                                                            </Button>
                                                                            <Button type="primary" className="mr-1" onClick={() => {

                                                                            }}>
                                                                                <EditIcon color="info"/>
                                                                            </Button>
                                                                            <Button className="mr-1" type="danger" onClick={() => {
                                                                                // eslint-disable-next-line no-restricted-globals

                                                                            }}>
                                                                                <TrashIcon color="danger"/>
                                                                            </Button>
                                                                        </div>

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
