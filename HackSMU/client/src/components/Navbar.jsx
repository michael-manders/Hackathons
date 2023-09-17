import React from "react";

import "../assets/css/Navbar.css";
import logo from "../assets/images/logo.png";
import logo_text from "../assets/images/logo-text.png";

export default class Navbar extends React.Component {
    render() {
        return (
            <div id="navbar">
                <div
                    id="logo"
                    onClick={() => {
                        window.location.href = "/";
                    }}>
                    <img src={logo} alt="logo" id="acorn" />
                    <img src={logo_text} alt="" id="text" />
                </div>

                <div id="navlinks">
                    <a href="/" className="link">
                        Home
                    </a>
                    <a href="/visualization" className="link">
                        Visualization
                    </a>
                    <a href="/chatbot" className="link">
                        Chatbot
                    </a>
                    <a href="/workorder" id="workorder" className="link">
                        Work Order
                    </a>
                </div>
            </div>
        );
    }
}
