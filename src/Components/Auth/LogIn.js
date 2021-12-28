import React, {useState} from 'react'
import { MDBRow, MDBFooter, MDBAlert, MDBBox} from "mdbreact";
import { MDBCard, MDBCardBody, MDBCol } from 'mdbreact';
//import logo from "../../logo.png";
import 'mdbreact/dist/css/mdb.css';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import Firebase from '../Firebase';
import { Input } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";

const LogIn = () => {

    const history = useHistory();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
   const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(Firebase.auth());

    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [color, setColor] = useState("info");


    const handleEmail = () => {

    }

    const handlePassword = () => {

    }

    const handleLogin = () => {

    }

    const handleForgot = () => {

    }

    return (
        <div>
            <MDBBox>
                <MDBRow>
                    <MDBCol>
                        <img src='https://mdbcdn.b-cdn.net/img/new/slides/041.webp' className='img-fluid shadow-4' alt='...' />
                    </MDBCol>
                    <MDBCol>
                        <MDBCard  className="my-5 p-3">
                            <MDBCardBody>
                                <MDBRow className="mb-4">
                                    <MDBCol>
                                        {/*
                                        <img src={logo} style={{width:"15rem", height:"10rem"}} className="rounded mx-auto d-block" alt="aligment" />
                                        */}

                                    </MDBCol>
                                </MDBRow>
                                <form className="mt-4">
                                    <div className="grey-text mt-4">

                                        <Input size="large"
                                               type="email"
                                               placeholder="Your email address"
                                               className="my-3"
                                               prefix={<MailOutlined style={{color:"#1890ff"}}/>}
                                               onChange={handleEmail}
                                               value={email}
                                        />
                                        <Input.Password
                                            size="large"
                                            placeholder="Your password"
                                            value={password}
                                            className="mt-2 mb-3"
                                            onChange={handlePassword}
                                            prefix={<LockOutlined style={{color:"#1890ff"}}/>}
                                        />

                                    </div>

                                    {showAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3" >
                                                {errorMessage}
                                            </MDBAlert>
                                        </>
                                        : null }


                                    <div className="text-center py-4 mt-3">
                                        <Button className="w-100"  onClick={handleLogin} type="primary" shape="round" size="large">
                                            LOGIN {showLoading ? <div className="spinner-border mx-2 text-white spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : null}
                                        </Button>
                                    </div>
                                </form>
                            </MDBCardBody>
                            <MDBFooter>
                                <div className="text-center text-black-50 d-flex justify-content-center mb-3">
                                    forgot your password? <i onClick={handleForgot} className="font-italic text-primary"> click here</i>
                                </div>
                            </MDBFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBBox>
        </div>
    )


}
export default LogIn;
