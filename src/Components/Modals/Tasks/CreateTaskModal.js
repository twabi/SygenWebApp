import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../Firebase/FireFetch";
import {MDBAlert} from "mdbreact";
import {useAuthState} from "react-firebase-hooks/auth";
import Firebase from "../../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";
import emailjs from "emailjs-com";


const dbRef = Firebase.database().ref('System/Users');
const projectRef = Firebase.database().ref('System/Projects');
const moment = require("moment");
const {TextArea} = Input;
const CreateTaskModal = (props) => {

    const [users] = useListVals(dbRef);
    const [projects] = useListVals(projectRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [createdByID, setCreatedByID] = useState(null);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [deadline, setDeadline] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState(null);

    function onChangeOne(date, dateString) {
        setStartDate(dateString);
    }
    function changeStatus (selectedOption) {
        setStatus(selectedOption);
    }

    function changeProject (selectedOption) {
        setSelectedProject(selectedOption);
    }

    function changeUser (selectedOption) {
        setSelectedUser(selectedOption);
    }

    function changeType (selectedOption) {
        setType(selectedOption);
    }

    function changeDate(date, dateString) {
        setDeadline(dateString);
    }

    useEffect(() => {
        console.log(props.projectID);
        if(props.projectID){
            setSelectedProject(props.projectID);
        }
        if(loggedInUser){
            var userId = users[users.findIndex(x => (x.email) === loggedInUser.email)]
                &&users[users.findIndex(x => (x.email) === loggedInUser.email)].userID
            setCreatedByID(userId);
        }

    }, [loggedInUser, props.projectID, users])



    const addTask = (values) => {
        setShowLoading(true);

        var dateline = values.deadline;
        var date = values.startDate;

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var taskID = Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var object = {
            title : values.title,
            description : values.description,
            taskID : taskID,
            dateCreated:  timeStamp,
            createdByID: createdByID,
            startDate : date.format("YYYY-MM-DDTh:mm"),
            deadline : dateline.format("YYYY-MM-DDTh:mm"),
            assignedTo : values.assigned,
            projectID : values.project,
            taskStatus : values.status,
            taskType : values.type
        }

        console.log(object);

        const output = FireFetch.SaveTODB("Tasks", taskID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Task added successfully");
                setColor("success");
                setShowAlert(true);

                values.assigned.map((itemUser) => {
                    var userName = users[users.findIndex(x => (x.userID) === itemUser)]&&
                        users[users.findIndex(x => (x.userID) === itemUser)].firstname + " " +
                        users[users.findIndex(x => (x.userID) === itemUser)].surname

                    var userEmail = users[users.findIndex(x => (x.userID) === itemUser)]&&
                        users[users.findIndex(x => (x.userID) === itemUser)].email
                    var templateParams = {
                        userEmail: userEmail,
                        username: userName,
                    };
                    emailjs.send("service_efpjx59","template_4dyjwqy", templateParams)
                        .then(function(response) {
                            console.log('SUCCESS!', response.status, response.text);
                        }, function(error) {
                            console.log('FAILED...', error);
                        });
                })

                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);

            }
        }).catch((error) => {
            setMessage("Unable to add task, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                layout="vertical"
                onFinish={addTask}
                onFinishFailed={onFinishFailed}
                fields={[{
                        name: ["project"],
                        value: selectedProject,
                    }]}
            >

                <Form.Item label="Title"
                           name="title"
                           rules={[{ required: true, message: 'Please input task title!' }]}>
                    <Input type="text" placeholder="enter task title" id="title"/>
                </Form.Item>
                <Form.Item label="Description"
                           name="description"
                           rules={[{ required: true, message: 'Please input description!' }]}>
                    <TextArea type="text" placeholder="enter task description" aria-multiline={true} id="description"/>
                </Form.Item>
                <Form.Item label="Task Type"
                           name="type"
                           rules={[{ required: true, message: 'Please input task type!' }]}>
                    <Select placeholder="Select task type"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeType}>
                        {["Planning", "Design", "Bug Fix", "Implementation", "Code Review", "Testing", "Deployment"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Assigned Project"
                           name="project"
                           rules={[{ required: true, message: 'Please select the assigned project!' }]}>
                    <Select placeholder="Select assigned project"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeProject}>
                        {projects.map((item, index) => (
                            <Select.Option key={index}  value={item.projectID}>{item.name}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Assigned To"
                           name="assigned"
                           rules={[{ required: true, message: 'Please select the assigned dev!' }]}>
                    <Select placeholder="Select assigned user"
                            showSearch
                            mode="multiple"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeUser}>
                        {users.map((item, index) => (
                            <Select.Option key={index}  value={item.userID}>{item.firstname + " " + item.surname}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Task Status"
                           name="status"
                           rules={[{ required: true, message: 'Please input task status!' }]}>
                    <Select placeholder="Select task status"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeStatus}>
                        {["Incomplete", "Ongoing", "Complete", "Pending Further Info"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item
                    label="Select task Start Date"
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
                    label="Select Task Deadline"
                    name="deadline"
                    rules={[{ required: true,
                        message: 'Please input task deadline' }]}>
                    <DatePicker
                        placeholder="select deadline date"
                        showTime={{ format: 'HH:mm' }}
                        picker={"date"}
                        className="w-100"
                        onChange={changeDate} />

                </Form.Item>


                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3 font-italic" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }

                <Button appearance="primary" htmlType="submit" className="text-white"
                        style={{color: "#fff", background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                    Create
                </Button>

            </Form>

        </div>
    )

}

export default CreateTaskModal;
