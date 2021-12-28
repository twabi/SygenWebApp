import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
//import Firebase from "../Firebase";
import LogIn from "./Auth/LogIn";

const Navigation = () => {

    return (
        <Fragment>
            <Switch>

                <Route path="/" render={(props) => (
                    <LogIn {...props} />)} exact />

                <Route path="/login" render={(props) => (
                    <LogIn {...props} />)} exact />



            </Switch>
        </Fragment>
    );

}

export default Navigation;
