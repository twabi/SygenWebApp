import React, {useState} from "react";
import {
    MDBNavbar, MDBNavbarNav, MDBNavItem, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
} from "mdbreact";
import {Switch} from "antd";
import holder from "../../holder.jpg";
import Firebase from "../Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useListVals} from "react-firebase-hooks/database";

const dbRef = Firebase.database().ref('System/Users');
const NavBar = (props) => {
    const [checked, setChecked] = useState(true);
    const [userName, setUserName] = useState(null);
    const [user, error] = useAuthState(Firebase.auth());
    const [users] = useListVals(dbRef);

    const handleChecked = (check) => {
        setChecked(check);
        props.checkBack(check);
    }
    function onChange(checked) {
        setChecked(checked);
        props.checkBack(checked);
    }

    React.useEffect(() => {

        if(user){
            if(users){
                var title = users[users.findIndex(x => (x.email) === user.email)]&&users[users.findIndex(x => (x.email) === user.email)].role;
                setUserName(title);
            }
            //setUserName(user.email);
        }
        
        if(error){
            console.log(error.message);
            //window.location.href = "/login";
            //window.location.href = "/";
            //window.location.hash="no-back-button";
            //window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
            //window.onhashchange=function(){window.location.hash="no-back-button";}
        }

    }, [checked, error, user, users]);


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
    return(

        <MDBNavbar color="white" light expand="xs">
            <MDBNavbarNav left>
                <Switch checked={checked} style={{background: "#f06000"}} onChange={onChange} />
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem>
                    <MDBDropdown className="mx-2 mr-4">
                        <MDBDropdownToggle nav caret>
                            <div  className="d-inline" >
                                <p className="d-inline mx-1">{userName}</p>
                                {<img style={{width:"1.5rem", height:"1.5rem"}} src={holder} className="rounded mx-2 float-left d-inline" alt="aligment" />}
                            </div>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default">
                            <MDBDropdownItem href="#!">Settings</MDBDropdownItem>
                            <MDBDropdownItem href="#!" onClick={handleLogout}>Log Out</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBNavbar>
    );
}
export default NavBar;
