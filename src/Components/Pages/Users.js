import React, {useEffect, useState} from 'react'
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {Button, Card, Layout, Table, Tooltip} from "antd";
import {
    Dialog,
    SearchInput, EyeOpenIcon, TrashIcon, EditIcon, IconButton, DollarIcon,
} from "evergreen-ui";
import {
    MDBAlert,
    MDBCol,
    MDBRow,
} from "mdbreact";
import {Text} from "react-font";
import CreateUserModal from "../Modals/User/CreateUserModal";
import { useList, useListVals } from 'react-firebase-hooks/database';
import Firebase from "../Firebase";
import EditUserModal from "../Modals/User/EditUserModal";
import ViewUserModal from "../Modals/User/ViewUserModal";
import FireFetch from "../FireFetch";
import {useAuthState} from "react-firebase-hooks/auth";
import { useHistory } from 'react-router-dom';


const { Content } = Layout;
const dbRef = Firebase.database().ref('System/Users');
const moment = require("moment");
const Users = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Fullname',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },{
            title: 'User Role',
            dataIndex: 'userRole',
            key: 'userRole',
        },{
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
        },{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];


    const history = useHistory();
    const [users, loading, error] = useListVals(dbRef);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [showDeleteAlert, setDeleteAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [viewModal, setViewModal] = useState(false);


    useEffect(() => {
        if(loggedInUser){
            //console.log("logged in")
            if(error){
                alert(error.message);
            }

            if(users){
                var tempArray = [];
                users.map((user, index) => {
                    tempArray.push({
                        key: index + 1,
                        name: user.firstname + " " + user.surname,
                        phone: user.phone,
                        email: user.email,
                        userRole: user.role,
                        created : moment(user.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD-MMM-YY"),
                        dpt: user.department,
                        action: <div>
                            <Button intent="primary" onClick={() => {
                                setEditUser(user);
                                setViewModal(true);
                            }}>
                                <EyeOpenIcon color="blue700"/>
                            </Button>
                            <Button intent="danger" onClick={() => {
                                // eslint-disable-next-line no-restricted-globals
                                if (confirm("Are you sure you want to delete user?")) {
                                    deleteUser(user.userID);
                                }
                            }}>
                                <TrashIcon color="danger"/>
                            </Button>
                            <Button intent="edit" onClick={() => {
                                setEditUser(user);
                                setShowEditModal(true);
                            }}>
                                <EditIcon color="primary"/>
                            </Button></div>
                    });
                });

                setDataArray([...tempArray]);
                setUserArray([...tempArray]);
            }
        } else {
            //window.location.href = "/login";
        }

    }, [error, loggedInUser, users])


    const handleSearch = searchText => {
        const filteredEvents = userArray.filter(({ name, email, dpt, userRole }) => {
            name = name.toLowerCase();
            email = email.toLowerCase();
            dpt = dpt.toLowerCase();
            userRole = userRole.toLowerCase();
            return name.includes(searchText) || email.includes(searchText) || dpt.includes(searchText) || userRole.includes(searchText);
        });

        setDataArray(filteredEvents);
    };

    const deleteUser = (objectID) => {

        var payload = {
            "uid": objectID
        }

        console.log(objectID);
        const output = FireFetch.DeleteFromDB("Users", objectID);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("User deleted successfully");
                setColor("success");
                setDeleteAlert(true);
                setTimeout(() => {
                    setDeleteAlert(false);
                }, 3000);

                //delete from firebase auth using the cloud function deployed url
                fetch("https://us-central1-sales265-d18df.cloudfunctions.net/deleteUser",
                    {
                        method : 'POST',
                        body : JSON.stringify(payload),
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                    .then(response => response.text())
                    .then((result) => {
                        console.log(result)
                    })
                    .catch((error) => {
                        console.log('error', error)
                    });

            } else {
                setMessage("Unable to add user and error occurred :: " + result);
                setColor("danger");
                setDeleteAlert(true);
            }
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
                                    title="Create New Member"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateUserModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={showEditModal}
                                    title="Edit User"
                                    onCloseComplete={() => {setShowEditModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <EditUserModal editUser={editUser} modal={setShowEditModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={viewModal}
                                    title={
                                        <div className="w-100 d-flex justify-content-between">
                                            <b>View User</b>
                                            <div className="mr-2">
                                                <Tooltip placement="bottom" title="Employee Sales">
                                                    <IconButton icon={DollarIcon} intent="success" className="mr-1" onClick={() => {
                                                        editUser.role === "Admin" ? alert("User is not a sales rep") :
                                                            history.push({
                                                                pathname: '/sales',
                                                                filter: editUser.firstname + " " + editUser.surname,
                                                            });
                                                    }}/>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    }
                                    onCloseComplete={() => {setViewModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>

                                        <ViewUserModal editUser={editUser} modal={setViewModal}/>

                                    </MDBCol>

                                </Dialog>

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Members
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search members" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <Button size="large" type="primary" style={{background: "#f06000", borderColor: "#f06000"}} className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Member
                                                </Button>
                                            </MDBRow>
                                        </MDBCol>

                                    </MDBRow>

                                </Card>

                                <Card>
                                    {showDeleteAlert?
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

export default Users;
