import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { AiOutlineCamera, AiOutlinePaperClip } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";

function ChatInput({ handleSendMessage, setIsCaptureImage }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMessage] = useState("");

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiSelect = (e, emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMessage(message);
    };

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSendMessage(msg);
            setMessage("");
        }
    };

    return (
        <Container>
            <div className="inputContainer">
                <div className="emoji">
                    <BsEmojiSmile onClick={handleShowEmojiPicker} />
                    {showEmojiPicker && (
                        <Picker onEmojiClick={handleEmojiSelect} />
                    )}
                </div>
                <div className="textField">
                    <form onSubmit={handleSendMsg}>
                        <input
                            type="text"
                            placeholder="Write Something"
                            value={msg}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </form>
                </div>
                <div className="sendContainer">
                    <AiOutlineCamera
                        className="cameraBtn"
                        onClick={() => setIsCaptureImage(true)}
                    />
                    <AiOutlinePaperClip className="clipBtn" />
                    <div className="sendButton" onClick={handleSendMsg}>
                        <IoMdSend type="submit" />
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    position: relative;
    .inputContainer {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 5% 80% 15%;
        border-radius: 1.5rem;
        background-color: #f9f9f9;
        width: 90%;
        height: 100%;
        align-content: center;
        .emoji {
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
                font-size: 1.2rem;
            }
            .emoji-picker-react {
                position: absolute;
                top: -326px;
                left: 10px;
            }
        }
        .textField {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            form {
                width: 90%;
                input {
                    border: none;
                    width: 98%;
                    height: 100%;
                    background: #f9f9f9;
                    outline: none;
                }
            }
        }
        .sendContainer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            .cameraBtn,
            .clipBtn {
                font-size: 1.4rem;
                cursor: pointer;
            }
            .sendButton {
                background-color: #4c7dfe;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50%;
                border-radius: 1.4rem;
                color: white;
                cursor: pointer;
            }
        }
    }
`;

export default ChatInput;
