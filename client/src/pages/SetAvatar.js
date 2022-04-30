import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { SetAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

function SetAvatar() {
    const api = "https://api.multiavatar.com/452342";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        };
        fetchAvatars();
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
        }
    }, []);

    const toastOption = {
        autoClose: 3000,
        position: "top-right",
    };

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOption);
            return;
        }
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        const { data } = await axios.post(`${SetAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
        });
        console.log(data);
        if (data.status) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.user.avatarImage;
            const stringifiedUser = JSON.stringify(user);
            localStorage.setItem("chat-app-user", stringifiedUser);
            navigate("/");
        } else {
            toast.error("Error setting avatar. Try again", toastOption);
        }
    };
    return (
        <>
            {isLoading ? (
                <Container>
                    <iframe
                        title="loader"
                        src="https://giphy.com/embed/kUTME7ABmhYg5J3psM"
                        width="300"
                        height="200"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    className={`avatar ${
                                        selectedAvatar === index
                                            ? "selected"
                                            : ""
                                    }`}
                                    key={index}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="Avatar"
                                        onClick={() => {
                                            setSelectedAvatar(index);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={setProfilePicture} type="submit">
                        set as profile picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100wh;
    gap: 3rem;
    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 0.4rem solid transparent;
            border-radius: 5rem;
            img {
                height: 6rem;
                border: 0.1rem solid transparent;
            }
        }
        .selected {
            border: 0.4rem solid #377083;
            box-shadow: 0px 0px 3px 3px rgb(0 0 0 / 20%);
            transform: scale(1.05);
        }
    }
}
    button {
        border-radius: 2px;
        padding: 0.5rem 0.8rem;
        border: 1.5px solid #10a6b1;
        letter-spacing: 0.5px;
        font-weight: bold;
        background: #31c5e2;;
        text-transform: uppercase;
        cursor: pointer;
        transition: 0.5s ease-in-out;
        color: white;
        &:hover {
            background: #2c8191;
    }
`;

export default SetAvatar;
