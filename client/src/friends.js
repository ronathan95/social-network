import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsAndRequestsList,
    acceptFriendRequest,
    unfriend,
} from "./actions";

import { Typography, Button } from "@material-ui/core";

export default function Friends() {
    const dispatch = useDispatch();
    const requests = useSelector(
        (state) =>
            state.friendsAndRequestsList &&
            state.friendsAndRequestsList.filter(
                (friend) => friend.accepted == false
            )
    );
    const friends = useSelector(
        (state) =>
            state.friendsAndRequestsList &&
            state.friendsAndRequestsList.filter(
                (friend) => friend.accepted == true
            )
    );

    const BUTTON_TEXT = {
        MAKE_REQUEST: "Make Request",
        CNCL_REQUEST: "Cancel Request",
        ACCPT_REQUEST: "Accept Request",
        UNFRIEND: "Unfriend",
    };

    useEffect(() => {
        dispatch(getFriendsAndRequestsList());
    }, []);

    function handleAcceptClick(otherUserId) {
        dispatch(acceptFriendRequest(otherUserId));
    }

    function handleUnfriendClick(otherUserId) {
        dispatch(unfriend(otherUserId));
    }

    return (
        <div className="friends">
            <Typography variant="h6">Friends Requests</Typography>
            {requests &&
                requests.map((request) => (
                    <div className="friend-or-request" key={request.id}>
                        <Typography variant="body1">
                            {request.first} {request.last}
                        </Typography>
                        <img src={request.profile_pic} />
                        <Button
                            variant="outlined"
                            onClick={() => handleAcceptClick(request.id)}
                        >
                            {BUTTON_TEXT.ACCPT_REQUEST}
                        </Button>
                    </div>
                ))}
            <Typography variant="h6">Friends</Typography>
            {friends &&
                friends.map((friend) => (
                    <div className="friend-or-request" key={friend.id}>
                        <Typography variant="body1">
                            {friend.first} {friend.last}
                        </Typography>
                        <img src={friend.profile_pic} />
                        <Button
                            variant="outlined"
                            onClick={() => handleUnfriendClick(friend.id)}
                        >
                            {BUTTON_TEXT.UNFRIEND}
                        </Button>
                    </div>
                ))}
        </div>
    );
}
