import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import LogIn from "./Auth/LogIn";
import ForgotPassword from "./Auth/ForgotPassword";
import Home from "./Home";
import Users from "./Users";
import Projects from "./Projects";

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

                <Route path="/home" render={(props) => (
                    <Home {...props} />)} exact />

                <Route path="/users" render={(props) => (
                    <Users {...props} />)} exact />

                <Route path="/projects" render={(props) => (
                    <Projects {...props} />)} exact />

            </Switch>
        </Fragment>
    );

}

export default Navigation;
