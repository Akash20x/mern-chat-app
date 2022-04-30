import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { HiOutlineUserAdd } from "react-icons/hi";
import { chatContext, socketContext } from "../context/chat/chatContext";
import axios from "axios";

function Contacts({ contacts, currentUser, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [friends, setFriends] = useState([]);
    const [isShowResults, setIsShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const socket = useContext(socketContext);

    const searchInputRef = useRef();

    const { newChatIds, addNewChatId, removeNewChatId } =
        useContext(chatContext);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser.name);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    useEffect(() => {
        setFriends(contacts);
    }, [contacts]);

    useEffect(() => {
        console.log(newChatIds);
    }, [newChatIds]);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
        removeNewChatId(contact._id);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("insert-friend", (user) => {
                setFriends((prev) => [...prev, user]);
                // console.log("yes on");
            });
        }
    }, []);

    const handleSearch = async () => {
        const searchKey = searchInputRef.current.value;
        if (searchKey.length) {
            const { data } = await axios.post(
                "https://akash-chat-server.herokuapp.com/api/auth/search-friend",
                {
                    searchQ: searchKey,
                    currentUserId: currentUser._id,
                }
            );
            setSearchResults(data.users);
            setIsShowResults(true);
        }
    };

    function noFiends() {
        return (
            <>
                <div className="nofriends">
                    <h4>Looks like you don't have any friends, LiL.</h4>
                    <h5>Search and Add friends</h5>
                </div>
            </>
        );
    }

    const addNewChat = async (friendId) => {
        const { data } = await axios.post(
            "https://akash-chat-server.herokuapp.com/api/auth/add-friend",
            { currentUserId: currentUser._id, newFriendId: friendId }
        );
        socket.current.emit("add-friend", { to: friendId, user: currentUser });
        if (data.status) {
            setIsShowResults(false);
            setFriends((prev) => [...prev, data.user]);
        }
    };

    return (
        <>
            <Container>
                <div className="contacts">
                    <div className="currentUser">
                        <img
                            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                            alt="Avatar"
                        />
                        <h4>{currentUser.name}</h4>
                    </div>
                    <div className="search">
                        <div className="searchField">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search Friends"
                                onChange={() => setIsShowResults(false)}
                            />
                            <AiOutlineSearch
                                className="searchIcon"
                                title="search"
                                onClick={handleSearch}
                            />
                        </div>
                        {isShowResults && (
                            <div className="searchResults">
                                <div className="resultsClose">
                                    <AiOutlineClose
                                        onClick={() => setIsShowResults(false)}
                                        title="close"
                                    />
                                </div>

                                {searchResults.length === 0 && (
                                    <div className="noResult">
                                        No Result found
                                    </div>
                                )}

                                {searchResults &&
                                    searchResults.map((user, idx) => {
                                        return (
                                            <div key={idx} className="result">
                                                <img
                                                    src={`data:image/svg+xml;base64,${user.avatarImage}`}
                                                    alt="Avatar"
                                                />
                                                <p className="name">
                                                    {user.name}
                                                </p>
                                                <HiOutlineUserAdd
                                                    onClick={() =>
                                                        addNewChat(user._id)
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                    <div className="chats">
                        {contacts.length === 0 && friends.length === 0
                            ? noFiends()
                            : friends.map((contact, index) => {
                                  return (
                                      <div
                                          className={`contact ${
                                              index === currentSelected
                                                  ? "selected"
                                                  : ""
                                          }`}
                                          key={index}
                                          onClick={() =>
                                              changeCurrentChat(index, contact)
                                          }
                                      >
                                          <div className="avatar">
                                              <img
                                                  src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                                  alt="Avatar"
                                              />
                                          </div>
                                          <div className="username">
                                              <h5>{contact.name}</h5>
                                          </div>
                                          <div
                                              className={
                                                  newChatIds.includes(
                                                      contact._id
                                                  )
                                                      ? "new-chat"
                                                      : ""
                                              }
                                          ></div>
                                      </div>
                                  );
                              })}
                    </div>
                </div>
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f9f9f9;
    padding-top: 1rem;
    .currentUser {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 90%;
        padding: 0.4rem;
        color: #5f89fa;
        text-transform: capitalize;
        img {
            width: 3rem;
        }
    }
    .search {
        position: relative;
        padding: 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 90%;
        .searchField {
            position: relative;
            input {
                width: 100%;
                border: none;
                border-radius: 1.5rem;
                height: 1.8rem;
                padding-left: 1rem;
                padding-right: 2rem;
                outline: none;
            }
            .searchIcon {
                position: absolute;
                right: 0.6rem;
                top: 25%;
                cursor: pointer;
            }
        }
        .searchResults {
            position: absolute;
            width: 100%;
            top: 90%;
            left: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            background: #e6edff;
            padding: 0.2rem;
            // min-height: 9rem;
            max-height: 9.3rem;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 0.2rem;
                height: 1rem;
                &-thumb {
                    background-color: #c0e1fb;
                    width: 0.1rem;
                    border-radius: 1rem;
                }
            }
            .noResult {
                widht: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .result {
                display: flex;
                align-items: center;
                justify-content: space-around;
                background: #5f89fa;
                padding: 0.2rem 0;
                color: white;
                img {
                    width: 1.8rem;
                }
                svg {
                    cursor: pointer;
                }
                p {
                    width: 50%;
                    text-align: start;
                }
            }
            .resultsClose {
                display: flex;
                justify-content: end;
                margin: 0.2rem 0;
                cursor: pointer;
            }
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        .chats {
            width: 90%;
            height: 70vh;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 0.2rem;
                height: 1rem;
                &-thumb {
                    background-color: #c0e1fb;
                    width: 0.1rem;
                    border-radius: 1rem;
                }
            }
            .nofriends {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                height: 100%;
                text-align: center;
            }
            .contact {
                min-height: 4rem;
                width: 90%;
                cursor: pointer;
                border-radius: 0.2rem;
                padding: 0.4rem;
                display: grid;
                grid-template-columns: 20% 60% 10%;
                transition: 0.2s ease-in-out;
                gap: 1rem;
                .avatar {
                    display: flex;
                    align-items: center;
                    img {
                        height: 2.7rem;
                    }
                }
                .username {
                    display: flex;
                    align-items: center;
                    color: RGB(75, 125, 250);
                    font-weight: 600;
                    h5 {
                        text-transform: capitalize;
                    }
                }
                .new-chat {
                    width: 10px;
                    height: 10px;
                    border-radius: 1.5rem;
                    background-color: red;
                }
            }
            .selected {
                .username {
                    h5 {
                        color: white;
                    }
                }
                background-color: #659cff;
            }
        }
    }
    .current-user {
        display: flex;
        justify-content: center;
        aligh-items: center;
        gap: 2rem;
        .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
            }
        }
        .username {
            display: flex;
            justify-content: center;
            align-items: center;
            h2 {
                color: ;
            }
        }
    }
`;

export default Contacts;
