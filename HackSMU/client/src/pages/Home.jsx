import React from "react";

import "../assets/css/Homepage.css";

import Navbar from "../components/Navbar";

// import graph, bot, phone from react-icons
import { BsPhoneVibrateFill } from "react-icons/bs";
import { BiSolidBot } from "react-icons/bi";
import { GoGraph } from "react-icons/go";

const Home = () => {
    return (
        <div id="home">
            <Navbar />
            <div className="container">
                <div id="about">
                    <div id="mission">
                        <div id="text">
                            Intuitive{" "}
                            <span className="color">visualizations</span> of the
                            conditions of corporate assets.{" "}
                        </div>
                    </div>
                    <div id="vision">
                        <div id="text">
                            AI powered <span className="color">predictive</span>{" "}
                            analytics to help you make{" "}
                            <span className="color">informed</span> decisions.
                        </div>
                    </div>
                </div>
                <div id="about-scroll">
                    <div id="selector">
                        <div id="line"></div>
                        <div id="icons">
                            <div className="icon one ">
                                <GoGraph size="48px" color="var(--text)" />
                                <div className="tooltip">
                                    <div className="title-tt">
                                        Visualizations
                                    </div>
                                    <div className="text">
                                        Provides an intuitive way to view
                                        at-risk assets and work orders. Includes
                                        a graph so you can analyze trends and
                                        predict future maintenance needs.
                                    </div>
                                </div>
                            </div>
                            <div className="icon two">
                                <BiSolidBot size="48px" color="var(--text)" />
                                <div className="tooltip">
                                    <div className="title-tt">Chatbot</div>
                                    <div className="text">
                                        Provides an effective way to analyze
                                        data and get information. The chatbot is
                                        equipped with a lot of data and can will
                                        provide insightful answers to all your
                                        maintenance related questions.
                                    </div>
                                </div>
                            </div>
                            <div className="icon three">
                                <BsPhoneVibrateFill
                                    size="48px"
                                    color="var(--text)"
                                />
                                <div className="tooltip">
                                    <div className="title-tt">
                                        Push Notifications
                                    </div>
                                    <div className="text">
                                        Includes a way to submit work orders and
                                        alert the proper people through SMS and
                                        EMail.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
