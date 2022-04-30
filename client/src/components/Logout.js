import React from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Logout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <Button onClick={handleLogout}>
            <RiLogoutBoxRLine title="Logout" />
        </Button>
    );
}
const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.5rem;
        color: #0081ff;
    }
`;
export default Logout;
