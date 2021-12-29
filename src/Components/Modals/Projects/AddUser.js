import React, {useEffect, useState} from "react";
import {MDBAlert, MDBCol, MDBRow} from "mdbreact";
import {Button} from "evergreen-ui";
import {Form, Input, Select} from "antd";
import Firebase from "../../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";
import FireFetch from "../../Firebase/FireFetch";

const userRef = Firebase.database().ref('System/Users');
const AddUserLayout = (props) => {

    const [users] = useListVals(userRef);
    const [membersAssigned, setMembersAssigned] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [projectID, setProjectID] = useState(props.projectID);
    const [mArray, setMArray] = useState(props.members);

    useEffect(() => {
        setProjectID(props.projectID);
        setMArray(props.members);
    }, [props])


    function changeAssigned(assigned) {
        setMembersAssigned(assigned);
    }

    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };


    const handleCreate = (values) => {
        setShowLoading(true);
        //console.log(values.members);
        //console.log(mArray);
        var newMemberArray = values.members.concat(mArray).unique();
        var object = {
            "members" : newMemberArray
        }

        console.log(object);
        const output = FireFetch.updateInDB("Projects", projectID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Member added successfully");
                setShowLoading(false);
                setShowAlert(true);
                setColor("success");
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2100);

            }
        }).catch((error) => {
            setMessage("Unable to add member, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        })


    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return(
        <div>
            <MDBRow className="p-3">
                <Form layout="vertical"
                      onFinish={handleCreate}
                      onFinishFailed={onFinishFailed}
                      className="w-100">

                    <Form.Item label="Add new Members assigned to the project"
                               name="members"
                               rules={[{ required: true, message: 'Please select members assigned to the project!' }]}>
                        <Select placeholder="Select members to be assigned"
                                showSearch
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="text-white"
                                style={{color: "#fff", background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </MDBRow>
        </div>
    )

}
export default AddUserLayout;
