import React, {useEffect, useState} from 'react'
import { MDBRow, MDBFooter, MDBAlert, MDBBox} from "mdbreact";
import { MDBCard, MDBCardBody, MDBCol } from 'mdbreact';
import logo from "../../sygenlogo.png";
import 'mdbreact/dist/css/mdb.css';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import Firebase from '../Firebase';
import { Input } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import sygenImage from "../../sygen-model.png";

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


    const handleEmail = ({target : {value}}) => {
        setEmail(value);
    };

    const handlePassword = ({target : {value}}) => {
        setPassword(value);
    };

    const gotoHome = () => {
        history.push("/home");
    }

    const handleForgot = () => {
        history.push("/forgot");
    }

    useEffect(() => {
        if(user){
            gotoHome();

        }

        if(error){
            setShowLoading(false);
            setShowAlert(true);
            setColor("danger");
            setErrorMessage(error.message);
        }

        if(loading){
            setShowLoading(true);
        }
    }, [error, loading, user])

    const handleLogin = () => {

        if((email == null || password == null) || (email === "" || password === "")) {
            setErrorMessage("Fields cannot be left empty!");
            setShowAlert(true);
        } else {
            setShowLoading(true);
            signInWithEmailAndPassword(email, password);
        }

    }

    return (
        <div className="vh-100">
            <MDBBox>
                <MDBRow>
                    <MDBCol>
                        <img src={sygenImage} className='img-fluid shadow-4 vh-100' alt='...' />
                    </MDBCol>
                    <MDBCol md="4" className="d-flex align-items-center justify-content-center">
                        <MDBCard  className="m-2 p-3 mr-5 mt-5">
                            <MDBCardBody>
                                <MDBRow className="mb-5">
                                    <MDBCol>
                                        <img src={logo}
                                             style={{ height:"9rem"}} className="w-75 rounded mx-auto d-block" alt="aligment" />
                                    </MDBCol>
                                </MDBRow>
                                <form className="mt-4">
                                    <div className="grey-text mt-4">

                                        <Input size="large"
                                               type="email"
                                               placeholder="Your email address"
                                               className="my-3"
                                               prefix={<MailOutlined style={{color:"#000000"}}/>}
                                               onChange={handleEmail}
                                               value={email}
                                        />
                                        <Input.Password
                                            size="large"
                                            placeholder="Your password"
                                            value={password}
                                            className="mt-3 mb-3"
                                            onChange={handlePassword}
                                            prefix={<LockOutlined style={{color:"#000000"}}/>}
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
                                        <Button className="w-100"  onClick={handleLogin} type="primary" style={{backgroundColor:"#000000"}} shape="round" size="large">
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
