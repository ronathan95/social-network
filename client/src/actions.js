import axios from "./axios";

const BUTTON_TEXT = {
    MAKE_REQUEST: "Make Request",
    CNCL_REQUEST: "Cancel Request",
    ACCPT_REQUEST: "Accept Request",
    UNFRIEND: "Unfriend",
};

export async function getFriendsAndRequestsList() {
    const { data } = await axios.get("/friends-list");
    return {
        type: "GET_FRIENDS_AND_REQUESTS_LIST",
        friendsAndRequestsList: data.friendsList,
    };
}

export async function acceptFriendRequest(otherUserId) {
    await axios.post("/friendship-action", {
        action: BUTTON_TEXT.ACCPT_REQUEST,
        otherUserId: otherUserId,
    });
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        userIdOfAccepted: otherUserId,
    };
}

export async function unfriend(otherUserId) {
    await axios.post("/friendship-action", {
        action: BUTTON_TEXT.UNFRIEND,
        otherUserId: otherUserId,
    });
    return {
        type: "UNFRIEND",
        userIdOfUnfriend: otherUserId,
    };
}

export async function postNewMessage(userAndMessageInfo) {
    return {
        type: "POST_NEW_MESSAGE",
        userAndMessageInfo: userAndMessageInfo,
    };
}

export async function addTenMostRecentMessages(messages) {
    return {
        type: "ADD_TEN_MOST_RECENT_MESSAGES",
        messages: messages,
    };
}
