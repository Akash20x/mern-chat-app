import React, { useState, useRef } from "react";
import { chatContext, socketContext } from "./chatContext";
import { io } from "socket.io-client";

function ChatState({ children }) {
    const [newChatIds, setNewChatIds] = useState([]);
    const addNewChatId = (userId) => {
        console.log("working");
        const chats = [...newChatIds];
        chats.push(userId);
        setNewChatIds(chats);
    };
    const removeNewChatId = (userId) => {
        const ids = [...newChatIds];
        const newChats = ids.filter((id) => {
            return id !== userId;
        });
        setNewChatIds(newChats);
    };
    return (
        <chatContext.Provider
            value={{ newChatIds, addNewChatId, removeNewChatId }}
        >
            {children}
        </chatContext.Provider>
    );
}

export function GetSocket({ children }) {
    const socket = useRef();

    socket.current = io("https://akash-chat-server.herokuapp.com");

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
}

export default ChatState;
