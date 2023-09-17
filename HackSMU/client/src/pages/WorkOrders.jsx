import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/WorkOrders.css";

export default class WorkOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            type: "",
            text: "",
            floor: "", // Add floor property
        };

        this.handelnameChange = this.handelnameChange.bind(this);
        this.handelemailChange = this.handelemailChange.bind(this);
        this.handeltypeChange = this.handeltypeChange.bind(this);
        this.handeltextChange = this.handeltextChange.bind(this);
        this.handelFloorChange = this.handelFloorChange.bind(this); // Bind floor input change handler

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handelnameChange(event) {
        this.setState({ name: event.target.value });
    }

    handelemailChange(event) {
        this.setState({ email: event.target.value });
    }

    handeltypeChange(event) {
        this.setState({ type: event.target.value });
    }

    handeltextChange(event) {
        this.setState({ text: event.target.value });
    }

    handelFloorChange(event) {
        this.setState({ floor: event.target.value }); // Update floor state
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        let obj = {
            name: this.state.name,
            email: this.state.email,
            type: this.state.type,
            text: this.state.text,
            floor: this.state.floor, // Include floor in the submitted data
        };

        let res = await fetch(
            "http://127.0.0.1:5000/submitWorkOrder-api" +
                "?workorder=" +
                JSON.stringify(obj)
        );

        let container = document.querySelector(".workorder-container");
        container.innerHTML = "<h1>Work Order Submitted</h1>";
    }

    render() {
        return (
            <div className="workorder-contain">
                <Navbar />
                <div className="workorder-container">
                    <div className="workorder-header">
                        <h1>Submit Work Order</h1>
                    </div>
                    <div className="workorder-form">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={this.handelnameChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onChange={this.handelemailChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    onChange={this.handeltypeChange}>
                                    <option
                                        value="none"
                                        selected
                                        disabled
                                        hidden>
                                        Select a Type
                                    </option>
                                    <option value="electric">
                                        Electric Panel
                                    </option>
                                    <option value="elevator">Elevator</option>
                                    <option value="fire">Fire Alarm</option>
                                    <option value="plumbing">
                                        Plumbing System
                                    </option>
                                    <option value="hvac">HVAC</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="floor">Floor Number</label>
                                <input
                                    type="text"
                                    id="floor"
                                    name="floor"
                                    onChange={this.handelFloorChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="text">Description</label>
                                <textarea
                                    id="text"
                                    name="text"
                                    rows="4"
                                    cols="50"
                                    onChange={this.handeltextChange}></textarea>
                            </div>
                            <input
                                type="submit"
                                value="Submit"
                                className="submit-button"
                                onClick={this.handleSubmit}
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
