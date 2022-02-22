import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../Firebase/FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";


const dbRef = Firebase.database().ref('System/Users');
const projectRef = Firebase.database().ref('System/Projects');
const moment = require("moment");
const {TextArea} = Input;
const EditTaskModal = (props) => {

    const [users] = useListVals(dbRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [deadline, setDeadline] = useState(null);
    const [projects] = useListVals(projectRef);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTask, setSelectedTask] = useState(props.selectedTask);
    const [selectedProject, setSelectedProject] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [expense, setExpense] = useState(null);

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

        setSelectedTask(props.selectedTask);

    }, [props])



    const editTask = (values) => {
        setShowLoading(true);

        var dateline = values.deadline;
        var date = values.startDate;

        var object = {
            title : values.title,
            description : values.description,
            startDate : date.format("YYYY-MM-DDTh:mm"),
            deadline : dateline.format("YYYY-MM-DDTh:mm"),
            assignedTo : values.assigned,
            projectID : values.project,
            expense : values.expense,
            taskStatus : values.status,
            taskType : values.type
        }


        console.log(object);


        const output = FireFetch.updateInDB("Tasks", selectedTask.taskID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Task edited successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);

            }
        }).catch((error) => {
            setMessage("Unable to edit task, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        });

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editTask}
                onFinishFailed={onFinishFailed}
                fields={[
                    {
                        name: ["type"],
                        value: selectedTask.taskType,
                    },{
                        name: ["project"],
                        value: selectedTask.projectID,
                    },{
                        name: ["assigned"],
                        value: selectedTask.assignedTo,
                    },{
                        name: ["status"],
                        value: selectedTask.taskStatus,
                    },{
                        name: ["title"],
                        value: selectedTask.title,
                    },{
                        name: ["description"],
                        value: selectedTask.description,
                    },{
                        name: ["startDate"],
                        value: !selectedTask.startDate ? undefined : moment(selectedTask.startDate, "YYYY-MM-DD h:mm"),
                    },{
                        name: ["deadline"],
                        value: !selectedTask.deadline ? undefined : moment(selectedTask.deadline, "YYYY-MM-DD h:mm"),
                    }, {
                        name: ["expense"],
                        value: selectedTask.expense
                    }
                ]}
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
                           rules={[{ required: true, message: 'Please select the assigned devs!' }]}>
                    <Select placeholder="Select assigned users"
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
                        {["Incomplete", "Ongoing", "Pending Further Info"].map((item, index) => (
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

                <Form.Item label="Enter estimated task expense (If applicable)"
                           name="expense"
                           rules={[]}>
                    <Input type="number" placeholder="enter expense amount" defaultValue={0} id="expense"/>
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
                    Edit
                </Button>

            </Form>

        </div>
    )

}

export default EditTaskModal;
