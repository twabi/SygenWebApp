import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import{ init } from 'emailjs-com';
init("user_2JD2DZg8xAHDW7e9kdorr");


const moment = require("moment");
const ViewUserModal = (props) => {

    const [user, setUser] = useState(props.editUser)
    const [DOB, setDOB] = useState(null);
    const [gender, setGender] = useState(null);
    const [role, setRole] = useState(null);



    useEffect(() => {
        setUser(props.editUser);
        setGender(props.editUser.gender);
        setDOB(props.editUser.dob);
        setRole(props.editUser.role);
    }, [props.editUser])



    return (
        <div>
            <Form
                layout="vertical"
            >

                <Form.Item label="First name">
                    <Input placeholder="enter user firstname" disabled={true} defaultValue={user.firstname} id="firstname"/>
                </Form.Item>
                <Form.Item label="Surname">
                    <Input placeholder="enter user surname" disabled={true} defaultValue={user.surname} id="surname"/>
                </Form.Item>
                <Form.Item label="Email" >
                    <Input type="email" disabled={true} defaultValue={user.email} placeholder="enter user email" id="email"/>
                </Form.Item>
                <Form.Item label="Phone">
                    <Input type="phone" disabled={true} defaultValue={user.phone} placeholder="enter user phone number" id="phone"/>
                </Form.Item>
                <Form.Item
                    label="Select Date of Birth">
                    <DatePicker
                        placeholder="select starting date"
                        picker={"date"}
                        value={!DOB ? undefined : moment(DOB, "YYYY-MM-DD")}
                        className="w-100"
                        disabled={true}/>

                </Form.Item>

                <Form.Item label="Gender">
                    <Select placeholder="Select user gender"
                            showSearch
                            value={gender}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            disabled={true}>
                        {["Male", "Female", "Rather Not Say"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Department">
                    <Input type="text" placeholder="enter user department" disabled={true} defaultValue={user.department} id="department"/>
                </Form.Item>
                <Form.Item label="Role">
                    <Select placeholder="Select user role"
                            showSearch
                            value={role}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            disabled={true}>
                        {["Admin", "SalesRep"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
            </Form>

        </div>
    )

}

export default ViewUserModal;