import React, {useEffect, useState} from "react";
import {Form, Input, InputNumber, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";

import{ init } from 'emailjs-com';
import FireFetch from "../../Firebase/FireFetch";
init("user_2JD2DZg8xAHDW7e9kdorr");


const moment = require("moment");
const EditUserModal = (props) => {

    const [user, setUser] = useState(props.editUser)
    const [gender, setGender] = useState(null);
    const [role, setRole] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    function changeGender(option) {
        setGender(option);
    }
    function changeRole(option) {
        setRole(option);
    }


    useEffect(() => {
        setUser(props.editUser);
        setGender(props.editUser.gender);
        setRole(props.editUser.role);
    }, [props.editUser])

    const editUser = (values) => {

        setShowLoading(true);
        var payload = {
            "firstname" : values.firstname,
            "surname" : values.surname,
            "email" : values.email,
            "phone" : values.phone,
            "gender" : values.gender,
            "department" : values.department,
            "role" : values.role,
            "percentage" : values.percentage
        };

        console.log(payload);

        FireFetch.updateInDB("Users", user.userID, payload)
            .then((result) => {
                if(result === "success"){
                    setMessage("User edited successfully");
                    setColor("success");
                    setShowAlert(true);
                    setShowLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                        props.modal(false);
                    }, 2000);
                }
            })
            .catch((error) => {
                setMessage("Unable to edit user and error occurred :: " + error);
                setColor("danger");
                setShowLoading(false);
                setShowAlert(true);
        });

    }


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editUser}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    firstname: user.firstname,
                    surname: user.surname,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    role: user.role,
                    department: user.department,
                    percentage: user.percentage,
                }}
            >

                <Form.Item label="First name" name={"firstname"}>
                    <Input placeholder="enter user firstname" id="firstname"/>
                </Form.Item>
                <Form.Item label="Surname" name={"surname"}>
                    <Input placeholder="enter user surname" id="surname"/>
                </Form.Item>
                <Form.Item label="Email" name={"email"}>
                    <Input type="email" placeholder="enter user email" id="email"/>
                </Form.Item>
                <Form.Item label="Phone" name={"phone"}>
                    <Input type="phone" placeholder="enter user phone number" id="phone"/>
                </Form.Item>

                <Form.Item label="Gender" name={"gender"}>
                    <Select placeholder="Select user gender"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeGender}>
                        {["Male", "Female", "Rather Not Say"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Department" name={"department"}>
                    <Input type="text" placeholder="enter user department" id="department"/>
                </Form.Item>
                <Form.Item label="Role" name={"role"}>
                    <Select placeholder="Select user role"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeRole}>
                        {["Team leader", "Chief Coder", "Task Master", "Web Master",
                            "Code Master", "Developer", "Sales Manager", "Sales Assistant"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item
                    label="Project Percentage"
                    name="percentage">
                    <InputNumber prefix="%" style={{ width: '100%' }}/>
                </Form.Item>

                    {showAlert?
                        <>
                            <MDBAlert color={color} className="my-3 font-italic" >
                                {message}
                            </MDBAlert>
                        </>
                        : null }

                <Button type="primary" htmlType="submit" className="text-white"
                        style={{background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                    Edit
                </Button>

            </Form>

        </div>
    )

}

export default EditUserModal;
