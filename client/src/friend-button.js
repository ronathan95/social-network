import React, { useState, useEffect } from "react";
import axios from "./axios";

import { Button } from "@material-ui/core";

export default function FriendButton({ id }) {
    const otherUserId = Number(id);
    const [buttonText, setButtonText] = useState("");

    const BUTTON_TEXT = {
        MAKE_REQUEST: "Make Request",
        CNCL_REQUEST: "Cancel Request",
        ACCPT_REQUEST: "Accept Request",
        UNFRIEND: "Unfriend",
    };

    useEffect(() => {
        axios
            .get("/friendship-status/" + otherUserId)
            .then(({ data }) => {
                if (data.requestSent) {
                    if (data.sender) {
                        //request was sent from this user
                        setButtonText(BUTTON_TEXT.CNCL_REQUEST);
                    } else {
                        //request was sent to this user
                        setButtonText(BUTTON_TEXT.ACCPT_REQUEST);
                    }
                } else if (data.friends) {
                    //users are friends
                    setButtonText(BUTTON_TEXT.UNFRIEND);
                } else if (!data.friends) {
                    //users aren't friends, no request
                    setButtonText(BUTTON_TEXT.MAKE_REQUEST);
                }
            })
            .catch((err) => {
                console.error(
                    `erron on axios.get(/friendship-status/${otherUserId}): `,
                    err
                );
            });
    }, [otherUserId]);

    function handleClick() {
        axios
            .post("/friendship-action", {
                action: buttonText,
                otherUserId: otherUserId,
            })
            .then(({ data }) => {
                setButtonText(data.changeBtnTextTo);
            })
            .catch((err) => {
                console.error(`erron on axios.post(/friendship-action): `, err);
            });
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClick}>
                {buttonText}
            </Button>
            {/* <button onClick={handleClick}>{buttonText}</button> */}
        </div>
    );
}
