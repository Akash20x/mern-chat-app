import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetAllFriends } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import ChatState from "../context/chat/ChatState";
import { socketContext } from "../context/chat/chatContext";

function ChatPage() {
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const navigate = useNavigate();

    const socket = useContext(socketContext);

    useEffect(() => {
        if (currentUser) {
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchCurrentUser() {
            const user = JSON.parse(localStorage.getItem("chat-app-user"));
            if (!user) navigate("/login");
            setCurrentUser(user);
        }
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            async function fetchUsers() {
                const { data } = await axios.get(
                    `${GetAllFriends}/${currentUser._id}`
                );
                console.log(data);
                if (data.friends) {
                    setContacts(data.friends);
                }
            }
            fetchUsers();
        }
    }, [currentUser]);
    const handleChangeChat = (chat) => {
        setCurrentChat(chat);
    };
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    return (
        <ChatState>
            <Container>
                <div className="container">
                    <Contacts
                        contacts={contacts}
                        currentUser={currentUser}
                        changeChat={handleChangeChat}
                    />
                    {currentChat === undefined ? (
                        <Welcome currentUser={currentUser} />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            currentUser={currentUser}
                        />
                    )}
                </div>
            </Container>
        </ChatState>
    );
}
const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100vw;
        padding: 1rem;
        .profile {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            img {
                width: 2.5rem;
            }
        }
        .brand {
            font-size: 1.8rem;
            font-weight: 500;
            text-transform: uppercase;
        }
    }
    .container {
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 750px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`;
export default ChatPage;
