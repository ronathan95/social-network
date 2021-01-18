import React from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.messages);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("new message", e.target.value);
        }
    };

    return (
        <div>
            <h1>Chat Page</h1>
            <div className="chat-container">
                {chatMessages &&
                    chatMessages.map((msg) => (
                        <div key={msg.id}>
                            <img
                                src={
                                    msg.profile_pic ||
                                    "../default-profile-pic.jpg"
                                }
                            />
                            <p>
                                {msg.first} {msg.last} {msg.created_at}
                            </p>
                            <br />
                            <p> {msg.message} </p>
                        </div>
                    ))}
            </div>
            <textarea onKeyDown={handleKeyDown} />
        </div>
    );
}
