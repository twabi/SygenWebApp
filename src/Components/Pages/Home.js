import React, {useState} from 'react'
import {Card, Layout} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBBox, MDBCol, MDBRow} from "mdbreact";
import { MDBCard, MDBCardText } from 'mdbreact';
import {Text} from "react-font";


const { Content } = Layout;
const Home = () => {

    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
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
                                                        <MDBCard color={"deep-orange lighten-5"} className="m-2 p-3 w-100" style={{ height: "8rem" }}>
                                                                <span>
                                                                    <Text family='Nunito'  className="font-weight-bolder h5">Team Members</Text>
                                                                </span>
                                                            <h2 className="font-weight-bolder">
                                                                <Text family='Alfa Slab One' className="deep-orange-text font-weight-bolder">{4}</Text>
                                                            </h2>

                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard color={"deep-orange lighten-5"} className="m-2 p-3 w-100 " style={{height: "8rem" }}>
                                                            <span>
                                                                    <Text family='Nunito'  className="font-weight-bolder h5">Ongoing Projects</Text>
                                                                </span>
                                                            <h2 className="font-weight-bolder deep-orange-text">
                                                                <Text family='Alfa Slab One'>{5}</Text>
                                                            </h2>
                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard color={"deep-orange lighten-5"} className="m-2 p-3 w-100" style={{ height: "8rem" }}>
                                                            <span>
                                                                    <Text family='Nunito' className="font-weight-bolder h5">Pending Tasks</Text>
                                                                </span>
                                                            <h2 className="font-weight-bolder deep-orange-text">
                                                                <Text family='Alfa Slab One'>{87}</Text>
                                                            </h2>
                                                        </MDBCard>
                                                    </MDBCol>
                                                    <MDBCol>
                                                        <MDBCard color={"deep-orange lighten-5"} className="m-2 p-3 w-100 " style={{ height: "8rem" }}>
                                                            <span>
                                                                    <Text family='Nunito' className="font-weight-bolder h5">Projects Done</Text>
                                                                </span>
                                                            <h2 className="font-weight-bolder deep-orange-text">
                                                                <Text family='Alfa Slab One'><strong>{25}</strong></Text>
                                                            </h2>
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
                                    <MDBCol >
                                        <div className="py-2 mr-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="d-block">
                                                        <h5 className="font-weight-bold">
                                                            <Text family='Nunito'>
                                                                Other Details
                                                            </Text>
                                                        </h5>
                                                    </div>
                                                    {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                </div>

                                            </div>
                                            <hr/>
                                        </div>
                                    </MDBCol>

                                    <MDBRow>

                                        <MDBCol md={12}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow className="d-flex align-items-center">
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Number of Outlets Created
                                                                    </Text>
                                                                </h6>
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
                                                                        Most Sold Product (Sales)
                                                                    </Text>
                                                                </h6>
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
                                                                        Quantities Sold (Units)
                                                                    </Text>
                                                                </h6>
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
                                            </MDBRow>
                                        </MDBCol>
                                        <MDBCol md={12}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Employee Sales
                                                                    </Text>
                                                                </h6>
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
                                            </MDBRow>

                                        </MDBCol>
                                        <MDBCol md={12}>
                                            <MDBRow className="w-100">
                                                <Card className="mt-2 w-100">
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <div className="d-block ml-3">
                                                                <h6 className="font-weight-bold">
                                                                    <Text family='Nunito'>
                                                                        Products Sold
                                                                    </Text>
                                                                </h6>
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
