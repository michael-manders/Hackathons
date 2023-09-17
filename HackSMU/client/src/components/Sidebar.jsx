import React from "react";
import { MdOutlineElevator, MdWaterDrop } from "react-icons/md";
import { AiFillThunderbolt, AiFillAlert } from "react-icons/ai";
import { PiFanFill } from "react-icons/pi";

import "../assets/css/Sidebar.css";

const Sidebar = (props) => {
    const { func, data } = props;
    return (
        <div id="sidebar">
            <SideBarButton
                icon={<AiFillThunderbolt size="48px" />}
                alt="Electrical Panel"
                selected={data === "Electrical Panel" ? "true" : "false"}
                func={func}
            />
            <SideBarButton
                icon={<MdOutlineElevator size="48px" />}
                alt="Elevator"
                selected={data === "Elevator" ? "true" : "false"}
                func={func}
            />
            <SideBarButton
                icon={<AiFillAlert size="48px" />}
                alt="Fire Alarm"
                selected={data === "Fire Alarm" ? "true" : "false"}
                func={func}
            />
            <SideBarButton
                icon={<PiFanFill size="48px" />}
                alt="HVAC"
                selected={data === "HVAC" ? "true" : "false"}
                func={func}
            />
            <SideBarButton
                icon={<MdWaterDrop size="48px" />}
                alt="Plumbing System"
                selected={data === "Plumbing System" ? "true" : "false"}
                func={func}
            />
        </div>
    );
};

const SideBarButton = (props) => {
    const { icon, alt = "name", selected = "false", func } = props;
    const handleClick = () => {
        func(alt);
    };
    return (
        <a
            id={selected === "true" ? "sidebar-icon-selected" : "sidebar-icon"}
            onClick={handleClick}>
            {icon}
            <span id="sidebar-tooltip">{alt}</span>
        </a>
    );
};

export default Sidebar;
