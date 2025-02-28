import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
    SimpleDateAndTime,
    SimpleDateMonthDay,
    SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
    const chatBox = useRef();
    const adminId = useSelector((store) => store.auth.user.data._id);
    const isTyping = useSelector((store) => store?.condition?.isTyping);

    const [scrollShow, setScrollShow] = useState(true);

    // Handle Chat Box Scroll Down
    const handleScrollDownChat = () => {
        if (chatBox.current) {
            chatBox.current.scrollTo({
                top: chatBox.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    // Scroll Button Hidden
    useEffect(() => {
        handleScrollDownChat();
        if (chatBox.current.scrollHeight === chatBox.current.clientHeight) {
            setScrollShow(false);
        }
        const handleScroll = () => {
            const currentScrollPos = chatBox.current.scrollTop;
            if (
                currentScrollPos + chatBox.current.clientHeight <
                chatBox.current.scrollHeight - 30
            ) {
                setScrollShow(true);
            } else {
                setScrollShow(false);
            }
        };
        const chatBoxCurrent = chatBox.current;
        chatBoxCurrent.addEventListener("scroll", handleScroll);
        return () => {
            chatBoxCurrent.removeEventListener("scroll", handleScroll);
        };
    }, [allMessage, isTyping]);

    return (
        <>
            {scrollShow && (
                <div
                    className="absolute bottom-16 right-4 cursor-pointer z-20 font-light  p-1.5 rounded-xl"
                    onClick={handleScrollDownChat}
                >
                    <CgChevronDoubleDown title="Scroll Down" fontSize={24} />
                </div>
            )}
            <div
                className="flex flex-col w-full px-3 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[66vh]"
                ref={chatBox}
            >
                {allMessage?.map((message, idx) => {
                    console.log(message?.sender?._id);
                    const isSender = message?.sender?._id === adminId;

                    // Debugging logs
                    console.log("Message Sender ID:", message?.sender?._id);
                    console.log("Admin ID:", adminId);
                    console.log("Is Sender:", isSender);

                    return (
                        <Fragment key={message._id}>
                            {/* Date Separator */}
                            <div className="sticky top-0 flex w-full justify-center z-10">
                                {new Date(
                                    allMessage[idx - 1]?.updatedAt
                                ).toDateString() !==
                                    new Date(
                                        message?.updatedAt
                                    ).toDateString() && (
                                        <span className="text-xs font-light mb-2 mt-1 text-white bg-black h-7 w-fit px-5 rounded-md flex items-center justify-center cursor-pointer">
                                            {SimpleDateMonthDay(message?.updatedAt)}
                                        </span>
                                    )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`flex gap-1 ${isSender ? " justify-end" : " justify-start"}`}
                            >
                                {/* Message Content */}
                                <div
                                    className={`${isSender
                                            ? "bg-blue-950 text-white rounded-xl"
                                            : "bg-black text-white rounded-xl"
                                        } py-1.5 px-2 min-w-10 text-start flex flex-col relative max-w-[85%]`}
                                >
                                    {/* Message Text */}
                                    <div
                                        className={`mt-1 pb-1.5 ${isSender ? "pr-16" : "pr-12"
                                            }`}
                                    >
                                        <span>{message?.message}</span>

                                        {/* Timestamp and Read Indicator */}
                                        <span
                                            className="text-[11px] font-light absolute bottom-1 right-2 flex items-end gap-1.5"
                                            title={SimpleDateAndTime(
                                                message?.updatedAt
                                            )}
                                        >
                                            {SimpleTime(message?.updatedAt)}
                                            {isSender ? (
                                                <VscCheckAll
                                                    color="white"
                                                    fontSize={14}
                                                />
                                            ) : <VscCheckAll
                                            color="white"
                                            fontSize={14}
                                        />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                    <div id="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllMessages;