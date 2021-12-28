import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import LogIn from "./Auth/LogIn";
import ForgotPassword from "./Auth/ForgotPassword";

const Navigation = () => {

    return (
        <Fragment>
            <Switch>

                <Route path="/" render={(props) => (
                    <LogIn {...props} />)} exact />

                <Route path="/login" render={(props) => (
                    <LogIn {...props} />)} exact />

                <Route path="/forgot" render={(props) => (
                    <ForgotPassword {...props} />)} exact />


            </Switch>
        </Fragment>
    );

}

export default Navigation;
