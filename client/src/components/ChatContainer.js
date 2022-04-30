import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
} from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Logout from "./Logout";
import { AddMessages } from "../utils/APIRoutes";
import axios from "axios";
import { GetMessages } from "../utils/APIRoutes";
import { chatContext, socketContext } from "../context/chat/chatContext";
import { MdOutlineCamera } from "react-icons/md";
import Webcam from "react-webcam";
import { BiSend } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

function ChatContainer({ currentChat, currentUser }) {
    const socket = useContext(socketContext);

    const [messages, setMessages] = useState([]);
    const [arrivalMsg, setArrivalMsg] = useState(undefined);
    const [cntChat, setCntChat] = useState({});
    const [isCaptureImage, setIsCaptureImage] = useState(false);
    const [capturedImage, setCapturedImage] = useState(undefined);
    console.log("yes");

    const videoRef = useRef(null);

    const { newChatIds, addNewChatId, removeNewChatId } =
        useContext(chatContext);

    //webcam
    const webcamRef = useRef(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    }, [webcamRef]);

    //sending message
    const handleSendMessage = async (msg) => {
        const message = {
            from: currentUser._id,
            to: currentChat._id,
            text: msg,
            messageType: capturedImage ? "img" : "text",
        };
        const { data } = await axios.post(AddMessages, message);

        socket.current.emit("send-message", message);
        const msgs = [...messages];
        msgs.push({ self: true, message: message });
        setMessages(msgs);
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await axios.get(
                `${GetMessages}?from=${currentUser._id}&to=${currentChat._id}`
            );
            setMessages(data.messages);
        };
        fetchMessages();
        setCntChat(currentChat);
    }, [currentChat]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("receive-message", (msg) => {
                setArrivalMsg(msg);
            });
        }
    }, []);

    useEffect(() => {
        if (arrivalMsg && currentChat._id === arrivalMsg.from) {
            const receivedMsg = {
                self: false,
                message: arrivalMsg,
            };
            setMessages((prev) => [...prev, receivedMsg]);
        } else if (arrivalMsg) {
            addNewChatId(arrivalMsg.from);
        }
    }, [arrivalMsg]);
    // comment

    const sendImage = () => {
        setIsCaptureImage(false);
        setCapturedImage(null);
        const receivedMsg = {
            self: false,
            type: "img",
            message: capturedImage,
        };
        setMessages((prev) => [...prev, receivedMsg]);
        handleSendMessage(capturedImage);
    };

    return (
        <>
            <Container>
                <div className="chat-header">
                    <div className="user">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt="Avatar"
                            />
                        </div>
                        <div className="username">{currentChat.name}</div>
                    </div>
                    <Logout />
                </div>

                {isCaptureImage ? (
                    <div className="camera-view-container">
                        <div className="camera-view">
                            {capturedImage ? (
                                <img src={capturedImage} alt="" />
                            ) : (
                                <Webcam
                                    audio={false}
                                    height={720}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={"100%"}
                                    videoConstraints={videoConstraints}
                                />
                            )}
                            <div
                                className={
                                    capturedImage ? "send-btn" : "capture-btn"
                                }
                            >
                                {capturedImage ? (
                                    <BiSend
                                        className="imgSend"
                                        onClick={sendImage}
                                    />
                                ) : (
                                    <MdOutlineCamera onClick={capture} />
                                )}
                            </div>
                        </div>
                        <div className="close-camera">
                            <AiOutlineClose
                                onClick={() => setIsCaptureImage(false)}
                                title="close"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <ChatMessages
                            currentChat={currentChat}
                            currentUser={currentUser}
                            messages={messages}
                        />
                        <ChatInput
                            handleSendMessage={handleSendMessage}
                            setIsCaptureImage={setIsCaptureImage}
                        />
                    </>
                )}
            </Container>
        </>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 12% 75% 13%;
    gap: 0.1rem;
    overflow: hidden;
    .camera-view-container {
        padding: 1rem;
        display: flex;
        justify-content: center;
        width: 100%;
        .close-camera {
            margin-left: 1rem;
            background: orange;
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            padding: 5px;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;
        }
        .camera-view {
            border-radius: 15rem;
            height: 100%;
            position: relative;
            video,
            img {
                border-radius: 1rem;
                border: 3px solid #659cff;
                transform: rotateY(180deg);
                height: 100%;
            }
            .capture-btn {
                position: absolute;
                bottom: 0.5rem;
                right: 50%;
                transform: translateX(50%);
                width: 2rem;
                height: 2rem;
                display: flex;
                justify-content: center;
                background: #659cff;
                border: 1px solid;
                border-color: white;
                border-radius: 50%;
                cursor: pointer;
                svg {
                    width: 100%;
                    height: 100%;
                    color: white;
                }
            }
            .send-btn {
                position: absolute;
                bottom: 1rem;
                right: 1rem;
                width: 2.5rem;
                padding: 5px;
                height: 2.5rem;
                display: flex;
                justify-content: center;
                background: #659cff;
                border: 1px solid;
                border-color: white;
                border-radius: 50%;
                cursor: pointer;
                svg {
                    width: 100%;
                    height: 100%;
                    color: white;
                }
            }
        }
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        padding: 0.8rem;
        border-bottom: 1px solid #e4e4e4;
        .user {
            display: flex;
            align-items: center;
            gap: 1rem;
            .username {
                text-transform: capitalize;
                color: #8a8a8e;
                font-weight: 500;
            }
            .avatar {
                display: flex;
                align-items: center;
                width: 2.5rem;
            }
        }
    }
`;

export default ChatContainer;
