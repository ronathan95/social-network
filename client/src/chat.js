import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

import { Paper, Typography, TextareaAutosize } from "@material-ui/core";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.messages);

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("new message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <div className="chat-container">
                {chatMessages &&
                    chatMessages.map((msg) => (
                        <div className="chat-msg" key={msg.id}>
                            <Paper>
                                <img
                                    className="chat-profilepic"
                                    src={
                                        msg.profile_pic ||
                                        "../default-profile-pic.jpg"
                                    }
                                />
                                <Typography variant="caption">
                                    {msg.first} {msg.last}{" "}
                                    {formatDateTime(msg.created_at)}
                                </Typography>
                                <br />
                                <Typography>{msg.message}</Typography>
                            </Paper>
                        </div>
                    ))}
            </div>
            <TextareaAutosize
                ref={elemRef}
                cols="80"
                rows="10"
                placeholder="Type in your message and press Enter to send it"
                onKeyDown={handleKeyDown}
            />
        </>
    );
}

const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    }).format(new Date(date));
};
