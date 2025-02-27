import React, { useEffect, useState } from "react";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { setChatLoading } from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";
import { IoSearchOutline } from "react-icons/io5";

const MyChat = () => {
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    // Re-render on new message or group chat creation
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);

    // Fetch all chats
    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);

    // Filter chats based on search query
    const filteredChats = myChat.filter((chat) => {
        if (!searchQuery) return true; // Show all chats if no search query

        // For one-on-one chats, check the other user's email or phone
        if (chat.users && chat.users.length === 2) {
            const otherUser = chat.users.find((user) => user._id !== authUserId);
            if (otherUser) {
                const emailMatch = otherUser.email?.toLowerCase().includes(searchQuery.toLowerCase());
                const phoneMatch = otherUser.phone?.toLowerCase().includes(searchQuery.toLowerCase());
                return emailMatch || phoneMatch;
            }
        }

        // For group chats, check the chat name
        if (chat.isGroupChat) {
            return chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return false;
    });

    return (
        <>
            <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-white text-white border-slate-500">
                <span className="flex justify-center">
                    <img
                        src="https://s3-alpha-sig.figma.com/img/2251/bcc1/90c79d5b9c428484581b2a811dd92aa7?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ldACfoaBwSqFjjaL6JQ9avJCRmY93xqFqMHzylDTOHhQy21erEs8FhTReXkSbo-PEde2LZE5uUw1DDbD8B3Mf617lCfM3DbJgkcuOAIKDJmFU1Mms7XmS9a8weKYpNQi~5TPJSDHm5qpTJzlVeoH~lO6~9Sno7hKopt0PFq0MjEK14FwRLcgzAabFWD33nZKC0l0WfhX7RTWmHvC1ABELbsxxWSxWFPz-QpnjjstuqJGoQNu4YOcuuJx2lVy-fR~5KbT1Kptszddml~kPTHSTwarIv9fuk0PiWIDlRDQDakjIuqmnQpBqZtydh6-4d-n4FNgo8PIS7c7O7bduqW8yA__"
                        alt=""
                        className="h-[6vh]"
                    />
                </span>
            </div>

            {/* Search Bar */}
            <div className="flex flex-row px-4 mx-4 items-center border rounded-xl border-slate-200">
            <span className="items-center"><IoSearchOutline size={20}/></span>
            <div className="p-2 bg-white ">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=" flex w-[100%]"
                />
            </div>
            </div>

            {/* Chat List */}
            <div className="flex flex-col w-full px-4 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[73vh]">
                {myChat.length == 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {filteredChats?.length === 0 ? (
                            <div className="w-full h-full flex justify-center items-center text-black">
                                <h1 className="text-base font-semibold">
                                    No chats found.
                                </h1>
                            </div>
                        ) : (
                            filteredChats?.map((chat) => {
                                return (
                                    <div
                                        key={chat?._id}
                                        className={`w-full h-16 bg-white text-black border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 cursor-pointer ${
                                            selectedChat?._id == chat?._id
                                                ? "bg-blue-100"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => {
                                            dispatch(addSelectedChat(chat));
                                        }}
                                    >
                                        <img
                                            className="h-12 min-w-12 rounded-full"
                                            src={getChatImage(chat, authUserId) || "../../assets/group.png"}
                                            alt="img"
                                        />
                                        <div className="w-full">
                                            <div className="flex justify-between items-center w-full">
                                                <span className="line-clamp-1 capitalize">
                                                    {getChatName(chat, authUserId)}
                                                </span>
                                                <span className="text-xs font-light ml-1">
                                                    {chat?.latestMessage &&
                                                        SimpleTime(chat?.latestMessage?.createdAt)}
                                                </span>
                                            </div>
                                            <span className="text-xs font-light line-clamp-1 ">
                                                {chat?.latestMessage ? (
                                                    <div className="flex items-end gap-1">
                                                        <span>
                                                            {chat?.latestMessage?.sender?._id ===
                                                                authUserId && (
                                                                <VscCheckAll
                                                                    color="black"
                                                                    fontSize={14}
                                                                />
                                                            )}
                                                        </span>
                                                        <span className="line-clamp-1">
                                                            {chat?.latestMessage?.message}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-light">
                                                        {SimpleDateAndTime(chat?.createdAt)}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;