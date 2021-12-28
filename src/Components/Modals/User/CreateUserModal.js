import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import emailjs from "emailjs-com";
import {MDBAlert} from "mdbreact";

import{ init } from 'emailjs-com';
import SecondaryFirebase from "../../SecondaryFirebase";
init("user_2JD2DZg8xAHDW7e9kdorr");

const regEx = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g;
const moment = require("moment");
const CreateUserModal = (props) => {

    const [DOB, setDOB] = useState(null);
    const [gender, setGender] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [role, setRole] = useState(null);

    function changeGender(option) {
        setGender(option);
    }
    function onChangeOne(date, dateString) {
        setDOB(dateString);
    }
    function changeRole(option) {
        setRole(option);
    }


    const addUser = () => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var firstname = document.getElementById("firstname").value;
        var lastname = document.getElementById("surname").value;
        var email = document.getElementById("email").value
        var phone = document.getElementById("phone").value;
        var department = document.getElementById("department").value;
        var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        if(firstname.includes("/") || lastname.includes("/")){
            alert("The name cannot include a slash, use a dash or another symbol instead")
        } else {
            var object = {
                "firstname" : firstname,
                "surname" : lastname,
                "email" : email,
                "phone" : phone,
                "gender" : gender,
                "dob" : DOB,
                "dateCreated" : timeStamp,
                "department" : department,
                "role" : role,
                //"password" : randPassword
            };
            var templateParams = {
                userEmail: object.email,
                username: object.firstname + " " + object.surname,
                userPassword : randPassword
            };

            SecondaryFirebase.auth().createUserWithEmailAndPassword(email, randPassword)
                .then((userCredential) => {
                    var user = userCredential.user;
                    object.userID = user.uid;

                    const output = FireFetch.SaveTODB("Users", user.uid, object);
                    output.then((result) => {
                        console.log(result);
                        if(result === "success"){
                            emailjs.send("service_efpjx59","template_jupp43q", templateParams)
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
                               name="First name"
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
                               name="Phone"
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
                    <Form.Item
                        label="Select Date of Birth"
                        name="birth date"
                        rules={[{ required: true,
                            message: 'Please input Date of Birth!' }]}>
                        <DatePicker
                            placeholder="select starting date"
                            picker={"date"}
                            defaultValue={moment('1990-01-01', 'YYYY-MM-DD')}
                            className="w-100"
                            onChange={onChangeOne} />

                    </Form.Item>

                    <Form.Item label="Gender"
                               name="Gender"
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
                    <Form.Item label="Department">
                        <Input type="text" placeholder="Enter department" id="department"/>
                    </Form.Item>
                    <Form.Item label="Role"
                               name="Role"
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
                        Create
                    </Button>

                </Form>

        </div>
    )

}

export default CreateUserModal;
