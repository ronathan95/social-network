import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsAndRequestsList,
    acceptFriendRequest,
    unfriend,
} from "./actions";

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
        <div>
            <h1>Friends Page</h1>
            <h3>Friends Requests</h3>
            {requests &&
                requests.map((request) => (
                    <div key={request.id}>
                        <p>
                            {request.first} {request.last}
                        </p>
                        <img src={request.profile_pic} />
                        <button onClick={() => handleAcceptClick(request.id)}>
                            {BUTTON_TEXT.ACCPT_REQUEST}
                        </button>
                    </div>
                ))}
            <h3>Friends</h3>
            {friends &&
                friends.map((friend) => (
                    <div key={friend.id}>
                        <p>
                            {friend.first} {friend.last}
                        </p>
                        <img src={friend.profile_pic} />
                        <button onClick={() => handleUnfriendClick(friend.id)}>
                            {BUTTON_TEXT.UNFRIEND}
                        </button>
                    </div>
                ))}
        </div>
    );
}
