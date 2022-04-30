import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

function ChatMessages({ currentUser, currentChat, messages }) {
    const scrollToRef = useRef(null);
    const scrollToBottom = () => {
        scrollToRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {}, [messages]);
    return (
        <Container>
            {messages.map((msg, idx) => {
                return (
                    <div
                        key={idx}
                        className={`content ${
                            msg.self ? "sended" : "received"
                        }`}
                    >
                        <div ref={scrollToRef} className="message">
                            <span>4:15</span>
                            {msg.message.messageType === "text" ? (
                                <p>{msg.message.text}</p>
                            ) : (
                                <img src={msg.message.text} alt="" />
                            )}
                        </div>
                    </div>
                );
            })}
        </Container>
    );
}
const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    height: 100%;
    overflow: auto;
    .content {
        display: flex;
        width: 100%;
        align-items: center;
        .message {
            display: flex;
            flex-direction: column;
            max-widht: 40%;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            border-radius: 0.6rem;
            p {
                margin-right: 1rem;
            }
            img {
                width: 17rem;
            }
            span {
                display: flex;
                justify-content: end;
                font-size: 0.5rem;
            }
        }
    }
    .sended {
        justify-content: flex-end;
        .message {
            color: white;
            background-color: #4a7efb;
        }
    }
    .received {
        justify-content: flex-start;
        .message {
            color: #606060;
            background-color: #e7e7e7;
        }
    }
`;

export default ChatMessages;
