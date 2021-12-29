import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";


const dbRef = Firebase.database().ref('System/Users');
const projectRef = Firebase.database().ref('System/Projects');
const moment = require("moment");
const {TextArea} = Input;
const ViewTaskModal = (props) => {

    const [users] = useListVals(dbRef);
    const [projects] = useListVals(projectRef);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [deadline, setDeadline] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTask, setSelectedTask] = useState(props.selectedTask);
    const [dateCreated, setDateCreated] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [startDate, setStartDate] = useState(null);


    useEffect(() => {

        setSelectedTask(props.selectedTask);
        setSelectedUser(props.selectedTask.assignedTo);
        setSelectedProject(props.selectedTask.projectID);
        setStatus(props.selectedTask.taskStatus);
        setDateCreated(props.selectedTask.dateCreated);
        setCreatedBy(props.selectedTask.createdByID);
        setStartDate(props.selectedTask.startDate);
        props.selectedTask.title ? setTitle(props.selectedTask.title) : setTitle("");
        props.selectedTask.description ? setDesc(props.selectedTask.description) : setDesc("");
        setType(props.selectedTask.taskType);
        setDeadline(props.selectedTask.deadline);



    }, [props])


    return (
        <div>
            <Form
                layout="vertical"
                fields={[
                    {
                        name: ["type"],
                        value: type,
                    },{
                        name: ["project"],
                        value: selectedProject,
                    },{
                        name: ["assigned"],
                        value: selectedUser,
                    },{
                        name: ["status"],
                        value: status,
                    },{
                        name: ["title"],
                        value: title,
                    },{
                        name: ["description"],
                        value: desc,
                    },{
                        name: ["startDate"],
                        value: !startDate ? undefined : moment(startDate, "YYYY-MM-DDTh:mm:ss"),
                    },{
                        name: ["deadline"],
                        value: !deadline ? undefined : moment(deadline, "YYYY-MM-DD h:mm"),
                    },{
                        name: ["createdBy"],
                        value: users[users.findIndex(x => (x.userID) === createdBy)]&&
                            users[users.findIndex(x => (x.userID) === createdBy)].firstname + " " +
                            users[users.findIndex(x => (x.userID) === createdBy)].surname,
                    }
                ]}
            >
                <Form.Item label="Title"
                           name="title"
                           rules={[{ required: true, message: 'Please input task title!' }]}>
                    <Input type="text" placeholder="enter task title" disabled={true} id="title"/>
                </Form.Item>
                <Form.Item label="Description"
                           name="description"
                           rules={[{ required: true, message: 'Please input description!' }]}>
                    <TextArea type="text" placeholder="enter task description" disabled={true} aria-multiline={true} id="description"/>
                </Form.Item>
                <Form.Item label="Task Type"
                           name="type"
                           rules={[{ required: true, message: 'Please input task type!' }]}>
                    <Select placeholder="Select task type"
                            showSearch
                            disabled={true}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }>
                        {["Bug Fix", "Implementation", "Code Review"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item label="Assigned Project"
                           name="project"
                           rules={[{ required: true, message: 'Please select the assigned project!' }]}>
                    <Select placeholder="Select assigned project"
                            showSearch
                            disabled={true}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }>
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
                            disabled={true}
                            mode="multiple"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }>
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
                            disabled={true}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            >
                        {["Incomplete", "Complete", "Pending Further Info"].map((item, index) => (
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
                        disabled={true} />

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
                        disabled={true}
                        className="w-100" />

                </Form.Item>

                <Form.Item label="Created By"
                           name="createdBy">
                    <Input type="text"
                           disabled={true}
                           id="createdBy"/>
                </Form.Item>


            </Form>

        </div>
    )

}

export default ViewTaskModal;
