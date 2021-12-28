import React, {useEffect, useState} from "react";
import 'react-pro-sidebar/dist/css/styles.css';
import {Layout} from "antd";
import SiderSmall from "./SiderSmall";
import SiderNormal from "./SiderNormal";


const { Sider } = Layout;

const SideBar = (props) => {

    const [isSmall, setIsSmall] = useState(false);

    const mq = window.matchMedia('(max-width: 768px)');


    const toggle = () => {
        if (mq.matches) {
            // do something here
            setIsSmall(true);
        } else {
            // do something here
            setIsSmall(false);
        }
    }


    useEffect(() => {
        toggle();

        // returns true when window is <= 768px
        mq.addListener(toggle);

        // unmount cleanup handler
        return () => mq.removeListener(toggle);
    }, [props.checked]);

    return (
        <div>
            {isSmall ?

                <SiderSmall checked={props.checked}/>

                :
                <SiderNormal checked={props.checked}/>
            }


        </div>
    );
}

export default SideBar;