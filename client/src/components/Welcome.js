import React from "react";
import styled from "styled-components";
import phone from "../assets/phone.png";

function Welcome({ currentUser }) {
    return (
        <>
            <Container>
                <img src={phone} alt="phone icon" />
                <h2>
                    Welcome, <span className="name">{currentUser.name}</span>
                </h2>
                <h3>Please select a chat to Start Messaging</h3>
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
        width: 6rem;
    }
`;

export default Welcome;
