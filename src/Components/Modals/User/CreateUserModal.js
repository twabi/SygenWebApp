import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, InputNumber, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../Firebase/FireFetch";
import emailjs from "emailjs-com";
import {MDBAlert} from "mdbreact";

import{ init } from 'emailjs-com';
import SecondaryFirebase from "../../SecondaryFirebase";
init("user_2JD2DZg8xAHDW7e9kdorr");

const regEx = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g;
const moment = require("moment");
const CreateUserModal = (props) => {

    const [gender, setGender] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [role, setRole] = useState(null);

    function changeGender(option) {
        setGender(option);
    }
    function changeRole(option) {
        setRole(option);
    }


    const addUser = (values) => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var object = {
            "firstname" : values.firstname,
            "surname" : values.surname,
            "email" : values.email,
            "phone" : values.phone,
            "gender" : values.gender,
            "dateCreated" : timeStamp,
            "department" : values.department,
            "role" : values.role,
            "percentage" : values.percentage
        };
        var templateParams = {
            userEmail: object.email,
            username: object.firstname + " " + object.surname,
            userPassword : randPassword
        };

        SecondaryFirebase.auth().createUserWithEmailAndPassword(values.email, randPassword)
            .then((userCredential) => {
                var user = userCredential.user;
                object.userID = user.uid;

                const output = FireFetch.SaveTODB("Users", user.uid, object);
                output.then((result) => {
                    console.log(result);
                    if(result === "success"){
                        emailjs.send("service_efpjx59","template_lcrv5bc", templateParams)
                            .then(function(response) {
                                console.log('SUCCESS!', response.status, response.text);
                            }, function(error) {
                                console.log('FAILED...', error);
                            });
                        setMessage("User added successfully");
                        setColor("success");
                        setShowAlert(true);
                        setShowLoading(false);
                        SecondaryFirebase.auth().signOut();
                        setTimeout(() => {
                            setShowAlert(false);
                            props.modal(false);
                        }, 2000);


                    }
                }).catch((error) => {
                    setMessage("Unable to add user and error occurred :: " + error);
                    setColor("danger");
                    setShowAlert(true);
                    setShowLoading(false);
                })

            })
            .catch((error) => {
                setMessage("Unable to add user and error occurred :: " + error);
                setColor("danger");
                setShowLoading(false);
                setShowAlert(true);
            })
    }


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
                <Form
                    layout="vertical"
                    onFinish={addUser}
                    onFinishFailed={onFinishFailed}
                >

                    <Form.Item label="First name"
                               name="firstname"
                               rules={[{ required: true, message: 'Please input first name!' }]}>
                        <Input placeholder="Enter firstname" id="firstname"/>
                    </Form.Item>
                    <Form.Item label="Surname"
                               name="surname"
                               rules={[{ required: true, message: 'Please input surname!' }]}>
                        <Input placeholder="Enter surname" id="surname"/>
                    </Form.Item>
                    <Form.Item label="Email" name="Email"
                               rules={[{ required: true, message: 'Please input Email!' }]}>
                        <Input type="email" placeholder="Enter email" id="email"/>
                    </Form.Item>
                    <Form.Item label="Phone"
                               name="phone"
                               rules={[{ required: true, message: 'Please input Phone!' },
                                   { min: 9, message: 'phone number must be minimum 9 characters.' },
                                   { max: 13, message: 'phone number cannot exceed 12 characters.' },
                                   {
                                   required: true,
                                   pattern: new RegExp(regEx),
                                   message: "Wrong phone number format!"}
                               ]}>
                        <Input type="phone" placeholder="Enter phone number" id="phone"/>
                    </Form.Item>

                    <Form.Item label="Gender"
                               name="gender"
                               rules={[{ required: true, message: 'Please input gender!' }]}>
                        <Select placeholder="Select gender"
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
                    <Form.Item label="Department" name="department">
                        <Input type="text" placeholder="Enter department" id="department"/>
                    </Form.Item>
                    <Form.Item label="Role"
                               name="role"
                               rules={[{ required: true, message: 'Please input user Role!' }]}>
                        <Select placeholder="Select role"
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
                        <InputNumber prefix="%" style={{ width: '100%' }} />
                    </Form.Item>
                    {showAlert?
                        <>
                            <MDBAlert color={color} className="my-3 font-italic" >
                                {message}
                            </MDBAlert>
                        </>
                        : null }

                    <Button type="primary" htmlType="submit" className="text-white" style={{background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                        Create
                    </Button>

                </Form>

        </div>
    )

}

export default CreateUserModal;
