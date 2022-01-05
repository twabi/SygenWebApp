import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../Firebase/FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";


const userRef = Firebase.database().ref('System/Users');
const moment = require("moment");
const EditProjectModal = (props) => {

    const [users] = useListVals(userRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(props.editProject);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [status, setStatus] = useState(null);
    const [membersAssigned, setMembersAssigned] = useState([]);

    function onChangeOne(date, dateString) {
        selectedProject.startDate = dateString;
        setStartDate(dateString);
    }
    function changeAssigned(assigned) {
        selectedProject.members = assigned;
        setMembersAssigned(assigned);
    }

    function onChangeTwo(date, dateString) {
        selectedProject.endDate = dateString;
        setEndDate(dateString);
    }
    function changeType(type) {
        selectedProject.type = type;
        setType(type);
    }
    function changeStatus(status) {
        selectedProject.status = status;
        setStatus(status);
    }

    function changePaymentType(type){
        selectedProject.paymentType = type;
        setPaymentType(type);
    }

    
    useEffect(() => {
        setSelectedProject(props.editProject);
    }, [props])


    const editProject = (result) => {
        console.log(result);
        setShowLoading(true);
        var projectID = selectedProject.projectID;


        var object = {
            "name" : result.name,
            "description" : result.description,
            "startDate" : moment(result.startDate).format("YYYY-MM-DD") ? moment(result.startDate).format("YYYY-MM-DD") : null,
            "endDate" : moment(result.endDate).format("YYYY-MM-DD") ? moment(result.endDate).format("YYYY-MM-DD") : null,
            "type" : result.type,
            "paymentType" : result.paymentType ? result.paymentType : "",
            "amount" : result.amount ? result.amount : "",
            "status" : result.status,
            "members" : result.members
        };

        console.log(object);

        const output = FireFetch.updateInDB("Projects", projectID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Project edited successfully");
                setShowAlert(true);
                setShowLoading(false);
                setColor("success");
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2100);

            }
        }).catch((error) => {
            setMessage("Unable to edit project, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        })



    }


    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editProject}
                fields={[
                    {name: ["name"], value: selectedProject.name},
                    {name: ["description"], value: selectedProject.description},
                    {name: ["startDate"], value: !selectedProject.startDate ? undefined : moment(selectedProject.startDate, "YYYY-MM-DD")},
                    {name: ["endDate"], value: !selectedProject.endDate ? undefined : moment(selectedProject.endDate, "YYYY-MM-DD")},
                    {name: ["type"], value: selectedProject.type},
                    {name: ["paymentType"], value: selectedProject.paymentType},
                    {name: ["amount"], value: selectedProject.amount},
                    {name: ["status"], value: selectedProject.status},
                    {name: ["members"], value: selectedProject.members},
                ]}
            >
                <Form.Item label="Project name"
                           name="name"
                           rules={[{ required: true, message: 'Please input outlet name!' }]}>
                    <Input placeholder="enter outlet name" //defaultValue={selectedProject.name}
                           onChange={(e)=>{selectedProject.name = e.target.value;}}
                           id="name"/>
                </Form.Item>
                <Form.Item label="Project Description"
                           name="description"
                           rules={[]}>
                    <Input placeholder="enter project description" //defaultValue={selectedProject.description}
                           onChange={(e)=>{selectedProject.description = e.target.value;}}
                           id="desc"/>
                </Form.Item>


                <Form.Item
                    label="Select Project Start Date"
                    name="startDate"
                    rules={[{ required: true,
                        message: 'Please input project start date!' }]}>
                    <DatePicker
                        placeholder="select starting date"
                        picker={"date"}
                        //defaultValue={!selectedProject.startDate ? undefined : moment(selectedProject.startDate, "YYYY-MM-DD")}
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
                        //defaultValue={!selectedProject.endDate ? undefined : moment(selectedProject.startDate, "YYYY-MM-DD")}
                        className="w-100"
                        onChange={onChangeTwo} />

                </Form.Item>

                <Form.Item label="Project Type"
                           name="type"
                           rules={[{ required: true,
                               message: 'Please input project type!' }]}>
                    <Select placeholder="Select project type"
                            showSearch
                            //defaultValue={selectedProject.type}
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
                            //defaultValue={selectedProject.paymentType}
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
                    <Input type="number" placeholder="enter payment amount" //defaultValue={selectedProject.amount}
                           onChange={(e)=>{selectedProject.amount = e.target.value;}}
                           id="amount"/>

                </Form.Item>

                <Form.Item label="Project Status"
                           name="status"
                           rules={[{ required: true,
                               message: 'Please input project status!' }]}>
                    <Select placeholder="Select project status"
                            showSearch
                            //defaultValue={selectedProject.status}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeStatus}>
                        {["Ongoing", "Completed", "To Do"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Select Members assigned to the project"
                           name="members"
                           rules={[{ required: true, message: 'Please select members assigned to the project!' }]}>
                    <Select placeholder="Select members to be assigned"
                            showSearch
                            //value={selectedProject.members}
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

                <Button type="primary" htmlType="submit" className="text-white" style={{background: "#f06000", borderColor: "#f06000"}} 
                        isLoading={showLoading}>
                    Edit
                </Button>

            </Form>

        </div>
    )

}

export default EditProjectModal;
