import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import {
    setChatDetailsBox,
    setMessageLoading,
} from "../../redux/slices/conditionSlice";
import { useDispatch, useSelector } from "react-redux";
import AllMessages from "./AllMessages";
import MessageSend from "./MessageSend";
import { addAllMessages } from "../../redux/slices/messageSlice";
import MessageLoading from "../loading/MessageLoading";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import  { getChatImage } from "../../utils/getChatName";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

const MessageBox = ({ chatId }) => {
    const dispatch = useDispatch();
    const chatDetailsBox = useRef(null);
    const [isExiting, setIsExiting] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    const isChatDetailsBox = useSelector(
        (store) => store?.condition?.isChatDetailsBox
    );
    const isMessageLoading = useSelector(
        (store) => store?.condition?.isMessageLoading
    );

    const allMessage = useSelector((store) => store?.message?.message);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const authUserId = useSelector((store) => store?.auth?._id);

    useEffect(() => {
        const getMessage = (chatId) => {
            dispatch(setMessageLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:` Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addAllMessages(json?.data || []));
                    dispatch(setMessageLoading(false));
                    socket.emit("join chat", selectedChat._id);
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setMessageLoading(false));
                    toast.error("Message Loading Failed");
                });
        };
        getMessage(chatId);
    }, [chatId]);

    const handleClickOutside = (event) => {
        if (
            chatDetailsBox.current &&
            !chatDetailsBox.current.contains(event.target)
        ) {
            setIsExiting(true);
            setTimeout(() => {
                dispatch(setChatDetailsBox(false));
                setIsExiting(false);
            }, 500);
        }
    };

    useEffect(() => {
        if (isChatDetailsBox) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatDetailsBox]);

    const toggleSidePanel = () => {
        setIsSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className="flex h-[90vh]">
            <div
                className={`transition-all duration-300 ${isSidePanelOpen ? "w-2/3" : "w-full"
                    }`}
            >
                <div className="py-6 sm:px-6 px-3 w-full h-[7vh] font-semibold flex justify-between items-center bg-white text-black">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(addSelectedChat(null));
                            }}
                            className="bg-white text-black h-8 w-8 rounded-md flex items-center justify-center"
                        >
                            <FaArrowLeft title="Back" fontSize={14} />
                        </div>
                        <div onClick={toggleSidePanel} className="flex flex-row items-center hover:text-xl">
                            <img
                                src={getChatImage(selectedChat, authUserId)}
                                alt=""
                                className="h-12 w-20 rounded-full"
                            />
                            <p className="text-center text-gray-600">
                                {selectedChat.users[1].username}
                            </p>
                        </div>
                    </div>
                    <div onClick={toggleSidePanel} className="md:hidden mr-4">
                        {isSidePanelOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
                    </div>
                </div>
                {isChatDetailsBox && (
                    <div
                        className={`h-[60vh] w-full max-w-96 absolute top-0 left-0 z-20 p-1 ${isExiting ? "box-exit" : "box-enter"
                            }`}
                    >
                    </div>
                )}
                {isMessageLoading ? (
                    <MessageLoading />
                ) : (
                    <AllMessages allMessage={allMessage} />
                )}
                <MessageSend chatId={chatId} />
            </div>

            {isSidePanelOpen && (
                <div className="w-1/3 bg-white shadow-lg z-30 p-4 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <AiOutlineClose
                            size={24}
                            onClick={toggleSidePanel}
                            className="cursor-pointer"
                        />
                    </div>
                    <img
                        src={getChatImage(selectedChat, authUserId)}
                        alt=""
                        className="h-auto rounded-full shadow-xl mx-auto mb-4"
                    />
                    {selectedChat && (
                        <div className="mt-4">
                            <p className="text-center text-gray-600">
                                {selectedChat.users[1].username}
                            </p>
                            <p className="text-center text-gray-600">
                                {selectedChat.users[1].phone}
                            </p>
                            <p className="text-center text-gray-600">
                                {selectedChat.users[1].email}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessageBox;
