import React, {useState} from 'react'
import {Avatar, Card, Layout} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBBox, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import { MDBCard, MDBCardText } from 'mdbreact';
import {Text} from "react-font";
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";
import {LineChart} from "../Charts/LineChart";
import {PieChart} from "../Charts/PieChart";
import {BarChart} from "../Charts/BarChart";


const userRef = Firebase.database().ref('System/Users');
const taskRef = Firebase.database().ref('System/Tasks');
const projRef = Firebase.database().ref('System/Projects');
const { Content } = Layout;
const Home = () => {

    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }

    const [users] = useListVals(userRef);
    const [tasks] = useListVals(taskRef);
    const [projects] = useListVals(projRef);

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

                        <MDBBox className="p-3">
                            <MDBRow>
                                <Card bordered={false} className="w-100 mr-2">
                                    <div className="text-left">
                                        <div className="d-block">
                                            <h5 className="font-weight-bold">
                                                <Text family='Nunito'>
                                                    Statistics
                                                </Text>
                                            </h5>
                                            <MDBCardText>
                                                <Text family='Nunito'>
                                                    An overview of system stats
                                                </Text>
                                            </MDBCardText>
                                            <hr/>
                                        </div>
                                        <div className="mt-4 py-1">
                                            <MDBRow>
                                                <MDBRow className="w-100">
                                                    <MDBCol>
                                                        <MDBCard className="m-2 p-3 w-100">
                                                            <div className="d-flex flex-row">
                                                                <div className="mr-2">
                                                                    <MDBIcon icon="users" className="border rounded mb-0 white-text p-3"
                                                                             style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size="2x"/>
                                                                </div>
                                                                <div className="ml-2 w-100">
                                                                    <div>
                                                                        <Text family='Nunito'  className="font-weight-bolder h6 mb-2">Team Members</Text>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Organization members: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{users&&users.length}</Text>
                                                                        </b>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Interns: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder text-right">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{1}</Text>
                                                                        </b>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard className="m-2 p-3 w-100 ">
                                                            <div className="d-flex flex-row">
                                                                <div className="mr-2">
                                                                    <MDBIcon icon="project-diagram" className="border rounded mb-0 white-text p-3"
                                                                             style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size="2x"/>
                                                                </div>
                                                                <div className="ml-2 w-100">
                                                                    <div>
                                                                        <Text family='Nunito'  className="font-weight-bolder h6 mb-2">Projects</Text>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Ongoing: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{projects&&projects.filter(x => x.status === "Ongoing").length}</Text>
                                                                        </b>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Completed: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder text-right">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{projects&&projects.filter(x => x.status === "Completed").length}</Text>
                                                                        </b>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard className="m-2 p-3 w-100">
                                                            <div className="d-flex flex-row">
                                                                <div className="mr-2">
                                                                    <MDBIcon icon="tasks" className="border rounded mb-0 white-text p-3"
                                                                             style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size="2x"/>
                                                                </div>
                                                                <div className="ml-2 w-100">
                                                                    <div>
                                                                        <Text family='Nunito'  className="font-weight-bolder h6 mb-2">Tasks</Text>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Incomplete: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">
                                                                                {tasks&&tasks.filter(x => x.taskStatus === "Ongoing" || x.taskStatus === "Incomplete" || x.taskStatus === "Pending Further Info").length}</Text>
                                                                        </b>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Completed: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder text-right">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{tasks&&tasks.filter(x => x.taskStatus === "Complete").length}</Text>
                                                                        </b>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard className="m-2 p-3 w-100 ">
                                                            <div className="d-flex flex-row">
                                                                <div className="mr-2">
                                                                    <MDBIcon icon="hand-holding-usd" className="border rounded mb-0 white-text p-3"
                                                                             style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size="2x"/>
                                                                </div>
                                                                <div className="ml-2 w-100">
                                                                    <div>
                                                                        <Text family='Nunito'  className="font-weight-bolder h6 mb-2">Revenue</Text>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Earnings: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{"K500,000"}</Text>
                                                                        </b>
                                                                    </div>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <Text family='Nunito'>Expenses: &nbsp;&nbsp;</Text>
                                                                        <b className="font-weight-bolder text-right">
                                                                            <Text family='Nunito' className="deep-orange-text font-weight-bolder">{"K130,000"}</Text>
                                                                        </b>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </MDBCard>
                                                    </MDBCol>
                                                </MDBRow>
                                            </MDBRow>
                                        </div>
                                    </div>

                                </Card>

                            </MDBRow>
                            <MDBRow>
                                <Card bordered={false} className="w-100 mt-3 mr-2">

                                    <MDBRow>
                                        <MDBCol md={7}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Revenue Vs Expense Per Project
                                                                    </Text>
                                                                </h6>
                                                            </div>
                                                            {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                        </MDBCol>

                                                    </MDBRow>
                                                    <hr/>
                                                    <MDBRow>
                                                        <Card bordered={false} className="w-100 bg-white">
                                                            <BarChart/>
                                                        </Card>

                                                    </MDBRow>

                                                </Card>
                                            </MDBRow>
                                        </MDBCol>
                                        <MDBCol md={5}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Task Completion Rate
                                                                    </Text>
                                                                </h6>
                                                            </div>
                                                            {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                        </MDBCol>

                                                    </MDBRow>
                                                    <hr/>
                                                    <MDBRow>
                                                        <Card bordered={false} className="w-100 bg-white">
                                                            <LineChart/>
                                                        </Card>

                                                    </MDBRow>

                                                </Card>
                                            </MDBRow>
                                        </MDBCol>
                                        <MDBCol md={6}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Projects Per Member
                                                                    </Text>
                                                                </h6>
                                                            </div>
                                                            {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                        </MDBCol>

                                                    </MDBRow>
                                                    <hr/>
                                                    <MDBRow>
                                                        <Card bordered={false} className="w-100 bg-white">
                                                            <PieChart/>
                                                        </Card>

                                                    </MDBRow>

                                                </Card>
                                            </MDBRow>
                                        </MDBCol>

                                        <MDBCol md={6}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Projects Created (Per Month)
                                                                    </Text>
                                                                </h6>
                                                            </div>
                                                            {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                        </MDBCol>

                                                    </MDBRow>
                                                    <hr/>
                                                    <MDBRow>
                                                        <Card bordered={false} className="w-100 bg-white">
                                                            <LineChart/>
                                                        </Card>

                                                    </MDBRow>

                                                </Card>
                                            </MDBRow>
                                        </MDBCol>

                                    </MDBRow>

                                </Card>
                            </MDBRow>

                        </MDBBox>

                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default Home;
