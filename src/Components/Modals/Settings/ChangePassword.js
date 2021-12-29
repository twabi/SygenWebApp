import React, {useEffect, useState} from "react";
import Firebase from "../../Firebase";
import {
    MDBCol, MDBRow, MDBModalBody, MDBBox, MDBCardFooter, MDBAlert
} from "mdbreact";
import {Button, Dialog, Text} from "evergreen-ui";
import {Input} from "antd";


const PasswordModal = (props) => {


    const [loading, setLoading] = React.useState(false);
    const [color, setColor] = useState("info");
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");


    useEffect(() => {
        //console.log(props.modal);
        //setModal(props.modal);
    }, [props]);

    const handleLogout = () => {
        Firebase.auth().signOut()
            .then(() => {
                window.location.href = "/";
                window.location.hash="no-back-button";
                window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
                window.onhashchange=function(){window.location.hash="no-back-button";}
            }).catch((err) => {
            alert("oops an error occurred : " + err);
        });
    }
    const handlePasswordChange = () => {
        setLoading(true);
        var email = document.getElementById("email").value;
        var passOne = document.getElementById("passOne").value;
        var passTwo = document.getElementById("passTwo").value;
        //var newPassword2 = document.getElementById("newPassword2").value;

        console.log(email, passOne, passTwo);

        if(email == null || passOne == null || passTwo == null){
            //passwords don't match
            setColor("danger");
            setMessage("Fields cannot be left empty!!");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } else {
            console.log(email + "-" + passOne);

            Firebase.auth()
                .signInWithEmailAndPassword(email, passOne)
                .then(function(user) {
                    console.log(user.user.uid);
                    Firebase.auth().currentUser.updatePassword(passTwo)
                        .then(function(){
                            //Do something
                            setColor("success");
                            setMessage("Updated successfully");
                            setShowAlert(true);
                            setTimeout(() => {
                                setShowAlert(false);
                            }, 3000);
                            setLoading(false);
                            //setModal(false);
                            props.modal();
                            handleLogout();

                        })
                        .catch(function(error){
                            //Do something
                            setColor("danger");
                            setMessage("Unable to add due to an error");
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
                                           id="email"/>

                                </div>
                                <div className="d-flex flex-row mt-3 ">
                                    <div className="d-flex flex-column w-100 mr-4">
                                        <Text className="font-italic mb-1">Enter current password</Text>
                                        <Input type="password"
                                               placeholder="enter old password"
                                               className="w-100"
                                               id="passOne"/>

                                    </div>
                                    <div className="d-flex flex-column w-100 ml-4">
                                        <Text className="font-italic mb-1">Enter preferred new Password</Text>
                                        <Input type="password"
                                               placeholder="enter new password"
                                               className="w-100"
                                               id="passTwo"/>
                                    </div>

                                </div>

                            </div>
                            <Button appearance="primary" htmlType="submit" className=" mt-3 text-white"
                                    style={{color: "#fff", background: "#f06000", borderColor: "#f06000"}} isLoading={loading} onClick={() => {
                                handlePasswordChange();
                            }}>Update Password</Button>

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

export default PasswordModal;
