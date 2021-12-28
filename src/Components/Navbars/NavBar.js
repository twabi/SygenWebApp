import React, {useState} from "react";
import {
    MDBNavbar, MDBNavbarNav, MDBNavItem, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon,
} from "mdbreact";
import {Position, SideSheet} from "evergreen-ui";
import { useAuthState } from 'react-firebase-hooks/auth';
import {Badge, Tooltip, Switch} from "antd";
import {MessageOutlined} from "@ant-design/icons";
import {useListVals} from "react-firebase-hooks/database";
import holder from "../../holder.jpg";

const NavBar = (props) => {
    const [checked, setChecked] = useState(true);
    const [userName, setUserName] = useState(null);
    //const [user, error] = useAuthState(Firebase.auth());
    const [showSide, setShowSide] = useState(false);
    //const [messages] = useListVals(messageRef);
    const [messageArray, setMessageArray] = useState([]);

    const handleChecked = (check) => {
        setChecked(check);
        props.checkBack(check);
    }
    function onChange(checked) {
        setChecked(checked);
        props.checkBack(checked);
    }

    /*
    React.useEffect(() => {
        localStorage.setItem("checked", checked);
        
        if(user){
            setUserName(user.email);

            if(messages){
                setMessageArray(messages.filter(x => ((x.status === "unread" && x.receiver === user.uid))))
            }
        }
        
        if(error){
            console.log(error);
            //window.location.href = "/login";
            window.location.href = "/";
            window.location.hash="no-back-button";
            window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
            window.onhashchange=function(){window.location.hash="no-back-button";}
        }

    }, [checked, error, messages, user]);

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

     */

    return(

        <MDBNavbar color="white" light expand="xs">
            <MDBNavbarNav left>
                <Switch checked={checked} style={{background: "#000"}} onChange={onChange} />
                {/*<Switch
                    height={21}
                    checked={checked}
                    onChange={e => handleChecked( e.target.checked )}
                />*/}
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem>
                    <MDBDropdown className="mx-2 mr-4">
                        <MDBDropdownToggle nav caret>
                            <div  className="d-inline" >
                                <p className="d-inline mx-1">{"userName"}</p>
                                {<img style={{width:"1.5rem", height:"1.5rem"}} src={holder} className="rounded mx-2 float-left d-inline" alt="aligment" />}
                            </div>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default">
                            <MDBDropdownItem href="#!">Settings</MDBDropdownItem>
                            <MDBDropdownItem href="#!">Log Out</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBNavbar>
    );
}
export default NavBar;
