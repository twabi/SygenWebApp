import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";

import{ init } from 'emailjs-com';
import FireFetch from "../../FireFetch";
init("user_2JD2DZg8xAHDW7e9kdorr");


const moment = require("moment");
const EditUserModal = (props) => {

    const [user, setUser] = useState(props.editUser)
    const [DOB, setDOB] = useState(null);
    const [gender, setGender] = useState(null);
    const [role, setRole] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    function changeGender(option) {
        setGender(option);
    }
    function onChangeOne(date, dateString) {
        setDOB(dateString);
    }
    function changeRole(option) {
        setRole(option);
    }


    useEffect(() => {
        setUser(props.editUser);
        setGender(props.editUser.gender);
        setDOB(props.editUser.dob);
        setRole(props.editUser.role);
    }, [props.editUser])

    const editUser = () => {

        var firstname = document.getElementById("firstname").value;
        var lastname = document.getElementById("surname").value;
        var email = document.getElementById("email").value
        var phone = document.getElementById("phone").value;
        var department = document.getElementById("department").value;


        setShowLoading(true);
        var payload = {
            "firstname" : firstname,
            "surname" : lastname,
            "email" : email,
            "phone" : phone,
            "gender" : gender,
            "dob" : DOB,
            "department" : department,
            "role" : role,
        };

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
            >

                <Form.Item label="First name">
                    <Input placeholder="enter user firstname" defaultValue={user.firstname} id="firstname"/>
                </Form.Item>
                <Form.Item label="Surname">
                    <Input placeholder="enter user surname" defaultValue={user.surname} id="surname"/>
                </Form.Item>
                <Form.Item label="Email" >
                    <Input type="email" defaultValue={user.email} placeholder="enter user email" id="email"/>
                </Form.Item>
                <Form.Item label="Phone">
                    <Input type="phone" defaultValue={user.phone} placeholder="enter user phone number" id="phone"/>
                </Form.Item>
                <Form.Item
                    label="Select Date of Birth">
                    <DatePicker
                        placeholder="select starting date"
                        picker={"date"}
                        value={!DOB ? undefined : moment(DOB, "YYYY-MM-DD")}
                        className="w-100"
                        onChange={onChangeOne} />

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
                            onChange={changeGender}>
                        {["Male", "Female", "Rather Not Say"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Department">
                    <Input type="text" placeholder="enter user department" defaultValue={user.department} id="department"/>
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
                            onChange={changeRole}>
                        {["Admin", "SalesRep"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item>
                    {showAlert?
                        <>
                            <MDBAlert color={color} className="my-3 font-italic" >
                                {message}
                            </MDBAlert>
                        </>
                        : null }
                </Form.Item>

                <Button appearance="primary" htmlType="submit" isLoading={showLoading}>
                    Edit
                </Button>

            </Form>

        </div>
    )

}

export default EditUserModal;