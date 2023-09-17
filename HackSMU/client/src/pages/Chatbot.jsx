import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/Chatbot.css";
import sendIcon from "../assets/images/send.png";
import loadingIcon from "../assets/images/loading.gif";

export default class Chatbot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            msg_history: [],
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    handleInputChange(event) {
        this.setState({
            message: event.target.value,
        });
    }

    async sendMessage() {
        const message = this.state.message;
        if (message === "") {
            return; // Exit early if the message is empty
        }

        // Update the message history first
        this.setState({
            msg_history: [
                ...this.state.msg_history,
                { role: "user", content: message },
            ],
            message: "", // Clear the input field after sending
        });

        let msg_history = this.state.msg_history;
        msg_history.push({ role: "user", content: message });
        console.log(msg_history);

        let chatbot_messages = document.getElementById("chatbot-messages");
        let loading = document.createElement("div");
        // add loading icon
        setTimeout(() => {
            loading.className = "message chatbot loading";
            loading.innerHTML = `<img src=${loadingIcon} alt="loading" />`;
            chatbot_messages.appendChild(loading);
        }, 50);
        // Make the API call (you can add error handling here)
        const API_PATH = "http://127.0.0.1:5000/chatbot-api";
        const response = await fetch(
            `${API_PATH}?history=${JSON.stringify(
                this.state.msg_history
            )}&message=${message}`
        );
        const data = await response.json();

        // remove loading icon
        chatbot_messages.removeChild(loading);

        // Update the message history with the response from the API
        // Update the message history with the response from the API
        this.setState({
            msg_history: [
                ...this.state.msg_history,
                {
                    role: "assistant",
                    content: data.content.replace("[lb]", "\n"), // Replace [lb] with \n
                },
            ],
        });
    }

    updateHight() {
        let chatbot_messages = document.getElementById("chatbot-messages");
        chatbot_messages.scrollTop = chatbot_messages.scrollHeight;
    }

    componentDidMount() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.sendMessage();
            }
        });

        document
            .getElementById("chatbot-messages")
            .addEventListener("DOMSubtreeModified", (event) => {
                this.updateHight();
            });
    }

    render() {
        return (
            <div id="chatbot">
                <Navbar></Navbar>
                <div id="container">
                    <div id="chatbot-container">
                        <div id="chatbot-messages">
                            <div className="message chatbot">
                                <p>
                                    Welcome! I'm here to help you analyze data
                                    from assets in a commercial building. Feel
                                    free to ask me any questions about
                                    equipment, manufacturers, repairs,
                                    operational hours, or any other related
                                    topics. Let's optimize your building's
                                    performance together!
                                </p>
                            </div>
                            {this.state.msg_history.map((item, index) => (
                                <div
                                    key={index}
                                    className={`message ${
                                        item.role === "user"
                                            ? "user"
                                            : "chatbot"
                                    }`}>
                                    <div
                                        style={{ whiteSpace: "pre-wrap" }}
                                        dangerouslySetInnerHTML={{
                                            __html: item.content,
                                        }}></div>
                                </div>
                            ))}
                        </div>
                        <div id="chatbot-input">
                            <input
                                type="text"
                                placeholder="Type your message here..."
                                value={this.state.message} // Use value to set input field value
                                onChange={this.handleInputChange}></input>
                            <img
                                src={sendIcon}
                                alt="send"
                                onClick={this.sendMessage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
