import io from "socket.io-client";
import { postNewMessage, addTenMostRecentMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("new message and user info", (userAndMessageInfo) => {
        store.dispatch(postNewMessage(userAndMessageInfo));
    });

    socket.on("10 most recent messages", (messages) => {
        store.dispatch(addTenMostRecentMessages(messages));
    });
};
