import React, {useState} from "react";
import {
    MDBAlert, MDBBox,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBFooter,
    MDBRow
} from "mdbreact";
import logo from "../../sygenlogo.png";
import sygenImage from "../../sygen-model.png";
import {Button, Input} from "antd";
import {useHistory} from 'react-router-dom';
import Firebase from "../Firebase/Firebase";
import {MailOutlined} from "@ant-design/icons";


const ForgotPassword = () => {

    const history = useHistory();
    const [email, setEmail] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [errorMessage, setErrorMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    const handleEmail = ({target : {value}}) => {
        setEmail(value);
    };

    const handleBack = () => {
        history.push("/login");
    };

    const sendEmailAdmin = () => {
        if(email == null || email === "") {
            setColor("danger");
            setErrorMessage("Email field is empty!");
            setShowAlert(true);
        } else {
            setShowLoading(false);
            Firebase.auth().sendPasswordResetEmail(email)
                .then(function () {
                    setColor("info");
                    setErrorMessage("Check your email for the password reset link");
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        handleBack();
                    }, 3000);
                    //handleBack();
                }).catch(function (e) {
                console.log(e)
            });

        }
    }

    return(
        <div className="vh-100">
            <MDBBox>
                <MDBRow>
                    <MDBCol>
                        <img src={sygenImage} className='img-fluid shadow-4 vh-100' alt='...' />
                    </MDBCol>
                    <MDBCol md="4" className="d-flex align-items-center justify-content-center">
                        <MDBCard  className="p-3 m-2 mr-5 mt-5 w-100">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <img src={logo}
                                             style={{ height:"9rem"}} className="w-75 rounded mx-auto d-block" alt="aligment" />                                    </MDBCol>
                                </MDBRow>
                                <form>

                                    <div className="grey-text">
                                        <Input size="large"
                                               type="email"
                                               placeholder="Your email address"
                                               className="mt-5 mb-3"
                                               prefix={<MailOutlined style={{color:"#000000"}}/>}
                                               onChange={handleEmail}
                                               value={email}
                                        />
                                    </div>

                                    {showAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3" >
                                                {errorMessage}
                                            </MDBAlert>
                                        </>
                                        : null }

                                    <div className="text-center py-4 mt-2">
                                        <Button onClick={sendEmailAdmin} className="w-100" type="primary" style={{backgroundColor:"#000000"}} shape="round" size="large">
                                            REPORT TO ADMIN {showLoading ? <div className="spinner-border mx-2 text-white spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : null}
                                        </Button>
                                    </div>
                                </form>
                            </MDBCardBody>
                            <MDBFooter>
                                <div className="text-center text-black-50 d-flex justify-content-center mt-1">
                                    <a onClick={handleBack} href className="font-italic text-primary">Back to log in</a>
                                </div>
                            </MDBFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBBox>
        </div>
    )
}

export default ForgotPassword;
