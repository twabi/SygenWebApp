import React, {useEffect, useState} from "react";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";
import {
    MDBCol, MDBRow, MDBModalBody,
} from "mdbreact";
import {Button, Dialog, Text} from "evergreen-ui";
import {Input} from "antd";


const dbRef = Firebase.database().ref('System/');
const EmailModal = (props) => {

    const [loading, setLoading] = React.useState(false);
    const [color, setColor] = useState("info");
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");



    useEffect(() => {
        //console.log(props.modal);
        //setModal2(props.modal);
    }, [props]);

    const handleEmailChange = () => {

        var oldEmail = document.getElementById("oldEmail").value;
        var currentPass = document.getElementById("password").value;
        var newEmail = document.getElementById("newEmail").value;

        console.log(oldEmail, currentPass, newEmail);
        setLoading(true);

        Firebase.auth()
            .signInWithEmailAndPassword(oldEmail, currentPass)
            .then(function(user) {

                Firebase.auth().currentUser.updateEmail(newEmail)
                    .then(function(){
                        //Do something
                        dbRef.child("Users").child(user.user.uid)
                            .update({email : newEmail})
                        setColor("success");
                        setMessage("Updated successfully");
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 3000);
                        props.modal();
                        setLoading(false);
                    })
                    .catch(function(error){
                        //Do something
                        setColor("danger");
                        setMessage("Unable to update due to an error");
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 3000);
                        setLoading(false);
                    });

            })
            .catch(function(error){
                //Do something
                setColor("danger");
                setMessage("Unable to update due to an error");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
                setLoading(false);
            });

    }
    return(
        <div>

                <MDBModalBody>
                    <MDBRow>
                        <MDBCol className="px-5">
                            <div className="d-flex flex-column ">
                                <div className="d-flex flex-column">
                                    <Text className="font-italic mb-1">Enter email address</Text>
                                    <Input type="email"
                                           placeholder="enter email"
                                           className="w-100 mr-4"
                                           id="oldEmail"/>

                                </div>
                                <div className="d-flex flex-row mt-3 ">
                                    <div className="d-flex flex-column w-100 mr-4">
                                        <Text className="font-italic mb-1">Enter current password</Text>
                                        <Input type="password"
                                               placeholder="enter old password"
                                               className="w-100"
                                               id="password"/>

                                    </div>
                                    <div className="d-flex flex-column w-100 ml-4">
                                        <Text className="font-italic mb-1">Enter preferred new email</Text>
                                        <Input type="email"
                                               placeholder="enter new email"
                                               className="w-100"
                                               id="newEmail"/>
                                    </div>

                                </div>

                            </div>
                            <Button appearance="primary" htmlType="submit" className=" mt-3 text-white"
                                    style={{color: "#fff", background: "#f06000", borderColor: "#f06000"}} isLoading={loading}
                                    onClick={() => {
                                handleEmailChange();
                            }}>Update Email</Button>

                        </MDBCol>
                    </MDBRow>
                </MDBModalBody>
                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }
        </div>
    );
}

export default EmailModal;
