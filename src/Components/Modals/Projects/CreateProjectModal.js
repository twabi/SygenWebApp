import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";
import {useAuthState} from "react-firebase-hooks/auth";
import Firebase from "../../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";
import FireFetch from "../../Firebase/FireFetch";


const userRef = Firebase.database().ref('System/Users');
const moment = require("moment");

const CreateProjectModal = (props) => {

    const [users] = useListVals(userRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [createdByID, setCreatedByID] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [status, setStatus] = useState(null);
    const [membersAssigned, setMembersAssigned] = useState([]);


    function onChangeOne(date, dateString) {
        setStartDate(dateString);
    }
    function onChangeTwo(date, dateString) {
        setEndDate(dateString);
    }

    function changeType(type) {
        setType(type);
    }

    function changePaymentType(type){
        setPaymentType(type);
    }

    function changeStatus(status) {
        setStatus(status);
    }

    function changeAssigned(assigned) {
        setMembersAssigned(assigned);
    }

    useEffect(() => {
        if(loggedInUser){
            var userId = users[users.findIndex(x => (x.email) === loggedInUser.email)]
                &&users[users.findIndex(x => (x.email) === loggedInUser.email)].userID
            setCreatedByID(userId);
        }

    }, [loggedInUser, users])


    const addProject = (result) => {

        setShowLoading(true);


        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var projectID =  Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');


        if(result.name.includes("/")){
            alert("The name cannot include a slash, use a dash or another symbol instead")
        } else {
            var object = {
                "name" : result.name,
                "description" : result.description,
                "startDate" : moment(result.startDate).format("YYYY-MM-DD") ? moment(result.startDate).format("YYYY-MM-DD") : null,
                "endDate" : moment(result.endDate).format("YYYY-MM-DD"),
                "type" : result.type,
                "paymentType" : result.paymentType ? result.paymentType : "",
                "amount" : result.amount ? result.amount : "",
                "status" : result.status,
                "dateCreated" : timeStamp,
                "createdByID" : createdByID,
                "projectID" : projectID,
                "members" : result.assigned
            };

            const output = FireFetch.SaveTODB("Projects", projectID, object);
            output.then((result) => {
                console.log(result);
                if(result === "success"){
                    setMessage("Project added successfully");
                    setColor("success");
                    setShowAlert(true);
                    setShowLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                        props.modal(false);
                    }, 2000);

                }
            }).catch((error) => {
                setMessage("Unable to add project, an error occurred :: " + error);
                setColor("danger");
                setShowAlert(true);
                setShowLoading(false);
            })



        }

    }


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                layout="vertical"
                onFinish={addProject}
                onFinishFailed={onFinishFailed}
            >

                <Form.Item label="Project name"
                           name="name"
                           rules={[{ required: true, message: 'Please input outlet name!' }]}>
                    <Input placeholder="enter outlet name" id="outletName"/>
                </Form.Item>
                <Form.Item label="Project Description"
                           name="description"
                           rules={[]}>
                    <Input placeholder="enter project description" id="desc"/>
                </Form.Item>


                <Form.Item
                    label="Select Project Start Date"
                    name="startDate"
                    rules={[{ required: true,
                        message: 'Please input project start date!' }]}>
                    <DatePicker
                        placeholder="select starting date"
                        picker={"date"}
                        //defaultValue={moment('1990-01-01', 'YYYY-MM-DD')}
                        className="w-100"
                        onChange={onChangeOne} />

                </Form.Item>

                <Form.Item
                    label="Select Project End Date"
                    name="endDate"
                    rules={[]}>
                    <DatePicker
                        placeholder="select ending date"
                        picker={"date"}
                        //defaultValue={moment('1990-01-01', 'YYYY-MM-DD')}
                        className="w-100"
                        onChange={onChangeTwo} />

                </Form.Item>

                <Form.Item label="Project Type"
                           name="type"
                           rules={[{ required: true,
                               message: 'Please input project type!' }]}>
                    <Select placeholder="Select project type"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeType}>
                        {["Internal", "Commercial", "R&D"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Payment Type"
                           name="paymentType">
                    <Select placeholder="Select payment type"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changePaymentType}>
                        {["Subscription", "Once-off Payment", "On-Credit"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Enter Payment amount (If applicable)"
                           name="amount"
                           rules={[]}>
                    <Input type="number" placeholder="enter payment amount" defaultValue={0} id="amount"/>

                </Form.Item>

                <Form.Item label="Project Status"
                           name="status"
                           rules={[{ required: true,
                               message: 'Please input project status!' }]}>
                    <Select placeholder="Select project status"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeStatus}>
                        {["Ongoing", "Completed (In-Production)", "To Do (Planning)"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Select Members assigned to the project"
                           name="assigned"
                           rules={[{ required: true, message: 'Please select members assigned to the project!' }]}>
                    <Select placeholder="Select members to be assigned"
                            showSearch
                            mode="multiple"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeAssigned}>
                        {users.sort().map((item, index) => (
                            <Select.Option key={index} value={item.userID}>{item.firstname + " " + item.surname}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                    {showAlert?
                        <>
                            <MDBAlert color={color} className="my-3 font-italic" >
                                {message}
                            </MDBAlert>
                        </>
                        : null }

                <Button type="primary" htmlType="submit" className="text-white"
                        style={{color: "#fff", background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                    Create
                </Button>

            </Form>

        </div>
    )

}

export default CreateProjectModal;
