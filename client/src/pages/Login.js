import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LoginRoute } from "../utils/APIRoutes";

function Register() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (localStorage.getItem("chat-app-user") != undefined) {
            console.log(localStorage.getItem("chat-app-user"));
            // navigate("/");
        }
    }, []);

    const toastOption = {
        autoClose: 3000,
        position: "top-right",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = values;
        if (validateValues()) {
            const { data } = await axios.post(LoginRoute, {
                email,
                password,
            });
            console.log(data);
            if (data.status === false) {
                toast.error(data.msg, toastOption);
            } else if (data.status === true) {
                localStorage.setItem(
                    "chat-app-user",
                    JSON.stringify(data.user)
                );
                navigate("/");
            }
        }
    };
    const validateValues = () => {
        const { email, password } = values;
        if (!email || email.length < 3 || !email.includes("@")) {
            toast.error("enter valid email", toastOption);
            return false;
        } else if (!password || password.length < 3) {
            toast.error("enter valid password", toastOption);
            return false;
        }
        return true;
    };
    return (
        <>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h2>Chat App</h2>
                        <p>LogIn</p>
                    </div>

                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="Email"
                        name="email"
                    />
                    <input
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        name="password"
                    />

                    <button>LogIn</button>
                    <span>
                        don't have an account?{" "}
                        <Link to={"/register"}>Register</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    widht: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    form {
        padding: 25px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: 2px solid #5f89fa;
        width: 26%;
    }
    h2,
    p {
        color: #5d89ff;
        margin: 0;
    }
    h2 {
        text-transform: uppercase;
    }
    p {
        margin-top: 5px;
        font-weight: bold;
    }
    input {
        padding: 0.5rem;
        border: 0.1px solid #5f89fa;
        border-radius: 2px;
        box-shadow: rgb(0 0 0 / 2%) 0px 1px 1px 0px,
            rgb(27 31 35 / 15%) 0px 0px 0px 0.5px;
        &:focus {
            border: 0.3px solid #5f89fa;
            box-shadow: rgb(64 223 255 / 2%) 0px 1px 2px 0px,
                rgb(90 153 255 / 45%) 0px 0px 0px 1px;
            outline: none;
        }
    }
    button {
        border-radius: 2px;
        padding: 5px;
        border: 1.5px solid #5f89fa;
        font-weight: 500;
        background: #5f89fa;
        text-transform: uppercase;
        cursor: pointer;
        transition: 0.5s ease-in-out;
        color: white;
        &:hover {
            background: #40bdd3;
        }
    }
    span {
        text-transform: uppercase;
        font-size: 0.8rem;
        a {
            text-decoration: none;
            color: #5f89fa;
        }
    }
`;

export default Register;
