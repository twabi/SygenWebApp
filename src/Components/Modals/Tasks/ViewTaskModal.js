import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";


const dbRef = Firebase.database().ref('System/Users');
const outletRef = Firebase.database().ref('System/Outlets');
const moment = require("moment");
const {TextArea} = Input;
const ViewTaskModal = (props) => {

    const [users] = useListVals(dbRef);
    const [outlets] = useListVals(outletRef);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [showBrand, setShowBrand] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [location, setLocation] = useState(null);
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTask, setSelectedTask] = useState(props.selectedTask);
    const [dateCreated, setDateCreated] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [showImages, setShowImages] = useState(false);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);


    useEffect(() => {
        if(props.selectedTask.taskType === "Brand Coverage"){
            console.log("in here");
            setShowBrand(true);
        }else {
            setShowBrand(false);
        }

        if(props.selectedTask.taskStatus === "Complete" && props.selectedTask.taskType === "Brand Coverage"){
            setShowImages(true);
        }


        setDateCreated(props.selectedTask.dateCreated);
        setCreatedBy(props.selectedTask.createdByID);
        setSelectedTask(props.selectedTask);
        setSelectedUser(props.selectedTask.assignedUser);
        setStatus(props.selectedTask.taskStatus);
        setType(props.selectedTask.taskType);
        setDeadline(props.selectedTask.deadline);
        props.selectedTask.title ? setTitle(props.selectedTask.title) : setTitle("");
        props.selectedTask.description ? setDesc(props.selectedTask.description) : setDesc("");
        !showBrand&&setSelectedOutlet(props.selectedTask.assignedOutlet)

    }, [props, showBrand])


    return (
        <div>
            <Form
                layout="vertical"
                fields={[
                    {
                        name: ["type"],
                        value: type,
                    },{
                        name: ["location"],
                        value: location,
                    },{
                        name: ["outlet"],
                        value: selectedOutlet,
                    },{
                        name: ["assigned"],
                        value: selectedUser,
                    },{
                        name: ["title"],
                        value: title,
                    },{
                        name: ["description"],
                        value: desc,
                    },{
                        name: ["status"],
                        value: status,
                    },{
                        name: ["deadline"],
                        value: !deadline ? undefined : moment(deadline, "YYYY-MM-DD h:mm"),
                    },{
                        name: ["dateCreated"],
                        value: moment(dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY"),
                    },{
                        name: ["createdBy"],
                        value: createdBy,
                    }
                ]}
            >

                <Form.Item label="Title"
                           name="title">
                    <Input type="text" disabled={true} placeholder="enter task title" id="title"/>
                </Form.Item>
                <Form.Item label="Description"
                           name="description">
                    <TextArea type="text" disabled={true} placeholder="enter task description" aria-multiline={true} id="description"/>
                </Form.Item>
                <Form.Item label="Task Type"
                           name="type">
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
                        {["Normal", "Brand Coverage"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                {showBrand ?
                    <Form.Item label="Coverage Location"
                               name="location">
                        <Input type="text"
                               disabled={true}
                               value={showBrand&&location}
                               placeholder="enter coverage location"
                               onChange={e => setLocation(e.target.value)} id="location"/>
                    </Form.Item>
                    :
                    <Form.Item label="Outlet Assigned"
                               name="outlet">
                        <Select placeholder="Select assigned outlet"
                                showSearch
                                disabled={true}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }>
                            {outlets.map((item, index) => (
                                <Select.Option key={index}  value={item.outletID}>{item.name}</Select.Option>
                            ))}

                        </Select>
                    </Form.Item>
                }


                <Form.Item label="Assigned To"
                           name="assigned">
                    <Select placeholder="Select assigned user"
                            showSearch
                            disabled={true}
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
                           name="status">
                    <Select placeholder="Select task status"
                            showSearch
                            disabled={true}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }>
                        {["Incomplete", "Complete", "Pending Further Info"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item
                    label="Task Deadline"
                    name="deadline">
                    <DatePicker
                        placeholder="select deadline date"
                        showTime={{ format: 'HH:mm' }}
                        disabled={true}
                        picker={"date"}
                        className="w-100" />

                </Form.Item>

                <Form.Item label="Date Created"
                           name="dateCreated">
                    <Input type="text"
                           disabled={true}
                           id="created"/>
                </Form.Item>

                <Form.Item label="Created By"
                           name="createdBy">
                    <Input type="text"
                           disabled={true}
                           id="createdBy"/>
                </Form.Item>

                {showImages ?
                    <>
                        <Form.Item label="Notes"
                                   name="notes">
                            <Input type="text"
                                   disabled={true}
                                   id="notes"/>
                        </Form.Item>


                        <Form.Item label="Images"
                                   name="images">

                            {selectedTask&&selectedTask.urls.map((url) => (
                                <img src={url} className="img-fluid  p-2" alt="" />
                            ))}
                        </Form.Item>
                    </>
                    :
                    null
                }


            </Form>

        </div>
    )

}

export default ViewTaskModal;
