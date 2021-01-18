export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_AND_REQUESTS_LIST") {
        state = {
            ...state,
            friendsAndRequestsList: action.friendsAndRequestsList,
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsAndRequestsList: state.friendsAndRequestsList.map(
                (friendOrRequest) => {
                    friendOrRequest.id == action.userIdOfAccepted &&
                        (friendOrRequest = {
                            ...friendOrRequest,
                            accepted: true,
                        });
                    return friendOrRequest;
                }
            ),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsAndRequestsList: state.friendsAndRequestsList.filter(
                (friendOrRequest) =>
                    friendOrRequest.id != action.userIdOfUnfriend
            ),
        };
    }

    if (action.type == "POST_NEW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.userAndMessageInfo],
        };
    }

    if (action.type == "ADD_TEN_MOST_RECENT_MESSAGES") {
        state = {
            ...state,
            messages: action.messages,
        };
    }

    return state;
}
