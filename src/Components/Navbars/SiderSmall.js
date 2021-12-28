import React, {useEffect, useState} from "react";
import {Heading, Paragraph, Position, SidebarTab, SideSheet, Tablist} from "evergreen-ui";
import {SidebarHeader, SidebarContent} from 'react-pro-sidebar';
import logo from "../../sygenlogo.png";
import {MDBIcon} from "mdbreact";
import {Text} from "react-font";
import {useHistory, useLocation} from "react-router-dom";

const SiderSmall = (props) => {

    const location = useLocation();
    const history = useHistory();
    const [collapsed, setCollapsed] = React.useState(true);
    const [isShown, setIsShown] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleRoutes = (route) => {
        setSelectedIndex(route);
        history.push(route);
    }

    useEffect(() => {
        var checked = props.checked;
        setCollapsed(!checked);
        setIsShown(checked);

    }, [props.checked]);

    return (
        <SideSheet
            position={Position.LEFT}
            width={150}
            isShown={isShown}
            onCloseComplete={() => setIsShown(!isShown)}
        >
            <div>
                <SidebarHeader>
                    <div className="d-flex justify-content-center p-2">
                        <div className="logo border-bottom border-light">
                            {collapsed ?
                                < >
                                    <img  src={logo} width={80} className="rounded float-left" alt="aligment" />
                                </>
                                :
                                <>
                                    <img  src={logo} className="rounded float-left w-100 p-1 " alt="aligment" />
                                </>

                            }

                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent className="pb-4">
                    <Tablist marginBottom={16} flexBasis={240}  className="mt-2 mx-1">
                        <SidebarTab
                            key="/home"
                            id="/home"
                            className={collapsed ? "p-3 py-4 mb3 text-center" : "p-3 py-4 mb3"}
                            onSelect={() => handleRoutes("/home")}
                            isSelected={"/home" === location.pathname}
                            aria-controls={`panel-${"/home"}`}
                        >

                            <MDBIcon icon="home" size="lg" className="mr-1"/>{collapsed? null :<Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Home</Text></Heading>}
                        </SidebarTab>

                        {!collapsed?
                            <Paragraph size={400}>
                                <Text family='Nunito' className="ml-2 mt-1 grey-text">
                                    PAGES
                                </Text>
                            </Paragraph>
                            : null}


                        <SidebarTab
                            key="/users"
                            id="/users"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("/users")}
                            isSelected={"/users" === location.pathname}
                            aria-controls={`panel-${"/users"}`}
                        >
                            <MDBIcon icon="users" className="mr-1 d-inline"/>{collapsed? null : <Heading className="d-inline" size={500}> <Text className="d-inline" family='Nunito'>Sales Reps</Text></Heading>}
                        </SidebarTab>

                        <SidebarTab
                            key="outlets"
                            id="outlets"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("outlets")}
                            isSelected={"/outlets" === location.pathname}
                            aria-controls={`panel-${"/outlets"}`}
                        >
                            <MDBIcon icon="store-alt" className="mr-1"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Outlets</Text></Heading>}
                        </SidebarTab>

                        <SidebarTab
                            key="products"
                            id="products"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("products")}
                            isSelected={("/products" === location.pathname) || ("/product" === location.pathname)}
                            aria-controls={`panel-${"/products"}`}
                        >
                            <MDBIcon icon="shopping-bag" className="mr-2"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Products</Text></Heading>}
                        </SidebarTab>

                        <SidebarTab
                            key="tasks"
                            id="tasks"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("tasks")}
                            isSelected={"/tasks" === location.pathname}
                            aria-controls={`panel-${"/tasks"}`}
                        >
                            <MDBIcon icon="map-marked-alt" className="mr-1"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Tasks</Text></Heading>}
                        </SidebarTab>


                        <SidebarTab
                            key="sales"
                            id="sales"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("sales")}
                            isSelected={"/sales" === location.pathname}
                            aria-controls={`panel-${"/sales"}`}
                        >
                            <MDBIcon icon="money-bill" className="mr-1"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Sales</Text></Heading>}
                        </SidebarTab>


                        <SidebarTab
                            key="logs"
                            id="logs"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("logs")}
                            isSelected={"/logs" === location.pathname}
                            aria-controls={`panel-${"/logs"}`}
                        >
                            <MDBIcon icon="clipboard-list" className="mr-2"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Logs</Text></Heading>}
                        </SidebarTab>

                        <SidebarTab
                            key="settings"
                            id="settings"
                            className={collapsed ? "p-3 py-4 h6 text-center" : "p-3 py-4 h6"}
                            onSelect={() => handleRoutes("settings")}
                            isSelected={"/settings" === location.pathname}
                            aria-controls={`panel-${"/settings"}`}
                        >
                            <MDBIcon icon="cog" className="mr-1"/>{collapsed? null : <Heading className="d-inline" size={500}><Text className="d-inline" family='Nunito'>Settings</Text></Heading>}
                        </SidebarTab>


                    </Tablist>
                </SidebarContent>

            </div>
        </SideSheet>
    )


}

export default SiderSmall;
