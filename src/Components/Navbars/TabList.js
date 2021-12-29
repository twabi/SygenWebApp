import React, {useEffect, useState} from 'react'
import {Heading, Paragraph, SidebarTab, Tablist} from "evergreen-ui";
import {MDBIcon} from "mdbreact";
import {Text} from "react-font";
import {useHistory, useLocation} from "react-router-dom";
import {Menu} from "antd";

const TabList = (props) => {

    const [collapsed, setCollapsed] = useState(props.collapsed);
    const location = useLocation();
    const history = useHistory();
    const [selectedIndex, setSelectedIndex] = useState(null);


    useEffect(() => {
        setCollapsed(props.collapsed);
    }, [props]);

    const handleRoutes = (route) => {
        setSelectedIndex(route);
        history.push(route);
    }

    const handleClick = e => {
        if(e.key === '/users'){
            handleRoutes("/users");
        } else if(e.key === '/home'){
            handleRoutes("/home");
        } else if(e.key === '/projects'){
            handleRoutes("/projects");
        } else if(e.key === '/tasks'){
            handleRoutes("/tasks");
        }
    };

    return (
        <Menu className="mt-2 mx-1" onClick={handleClick}>
            <Menu.Item
                key="/home"
                id="/home"
                className={collapsed ? "text-center h6 pl-2" : "h6 pl-2"}
                onSelect={() => handleRoutes("/home")}
                style={"/home" === location.pathname ? {background: "#f06000", color: "#fff"} : null}
                isSelected={"/home" === location.pathname}
                aria-controls={`panel-${"/home"}`}
            >
                <MDBIcon icon="home" size="lg" className="mr-3 d-inline"/>
                {collapsed? null :<Heading className="d-inline" size={500}><Text className={"/home" === location.pathname ? "d-inline text-white" : "d-inline"} family='Nunito'>Home</Text></Heading>}
            </Menu.Item>

            <Menu.Item
                key="/users"
                id="/users"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
                onSelect={() => handleRoutes("/users")}
                style={"/users" === location.pathname ? {background: "#f06000", color: "#fff"} : null}
                isSelected={"/users" === location.pathname}
                aria-controls={`panel-${"/users"}`}
            >
                <MDBIcon icon="users" size="lg" className="mr-3"/>
                {collapsed? null : <Heading className="d-inline" size={500}><Text className={"/users" === location.pathname ? "d-inline text-white" : "d-inline"} family='Nunito'>Members</Text></Heading>}
            </Menu.Item>

            <Menu.Item
                key="/projects"
                id="/projects"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
                onSelect={() => handleRoutes("/projects")}
                style={String(location.pathname).includes("/projects") ? {background: "#f06000", color: "#fff"} : null}
                isSelected={"/projects" === location.pathname || "/projects/:id" === location.pathname}
                aria-controls={`panel-${"/projects"}`}
            >
                <MDBIcon icon="project-diagram" size="lg" className="mr-3"/>
                {collapsed? null : <Heading className="d-inline" size={500}><Text className={String(location.pathname).includes("/projects") ? "d-inline text-white" : "d-inline"} family='Nunito'>Projects</Text></Heading>}
            </Menu.Item>

            <Menu.Item
                key="/tasks"
                id="/tasks"
                className={collapsed ? "h6 text-center pl-3" : "h6 pl-3"}
                onSelect={() => handleRoutes("/tasks")}
                style={"/tasks" === location.pathname ? {background: "#f06000", color: "#fff"} : null}
                isSelected={"/tasks" === location.pathname}
                aria-controls={`panel-${"/tasks"}`}
            >
                <MDBIcon icon="clipboard-list" size="lg" className="mr-3"/>
                {collapsed? null : <Heading className="d-inline" size={500}><Text className={"/tasks" === location.pathname ? "d-inline text-white" : "d-inline"} family='Nunito'>Tasks</Text></Heading>}
            </Menu.Item>



        </Menu>
    )
}
export default TabList;
