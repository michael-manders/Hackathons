import React from "react";

import "../assets/css/Elevator.css";

import ListViewer from "./ListViewer";

const Elevator = () => {
    return (
        <div id="elevator">
            <div id="top">
                <ListViewer title="AT RISK" />
                <ListViewer title="WORK ORDERS" />
            </div>

            <div id="bottom">
                <ListViewer title="GRAPH SHIT" />
            </div>
        </div>
    );
};

export default Elevator;
