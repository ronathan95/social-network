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
            friendsAndRequestsList: friendsAndRequestsList.map(
                (friendsAndRequestsList) => {
                    friendsAndRequestsList.id == action.userIdOfAccepted &&
                        (friendsAndRequestsList.accepted = true);
                }
            ),
        };
    }
    return state;
}
