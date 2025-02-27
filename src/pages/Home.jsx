import React, { useEffect } from "react";
import { MdChat, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import { logout } from "../redux/slices/authSlice"; // Import logout action
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
	addNewChat,
	addNewMessageRecieved,
	deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
let selectedChatCompare;


const Home = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isUserSearchBox = useSelector(
		(store) => store?.condition?.isUserSearchBox
	);
	const authUserId = useSelector((store) => store?.auth?._id);

	// socket connection
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	// socket message received
	useEffect(() => {
		selectedChatCompare = selectedChat;
		const messageHandler = (newMessageReceived) => {
			if (
				selectedChatCompare &&
				selectedChatCompare._id === newMessageReceived.chat._id
			) {
				dispatch(addNewMessage(newMessageReceived));
			} else {
				dispatch(addNewMessageRecieved(newMessageReceived));
			}
		};
		socket.on("message received", messageHandler);

		return () => {
			socket.off("message received", messageHandler);
		};
	});

	// socket clear chat messages
	useEffect(() => {
		const clearChatHandler = (chatId) => {
			if (chatId === selectedChat?._id) {
				dispatch(addAllMessages([]));
				toast.success("Cleared all messages");
			}
		};
		socket.on("clear chat", clearChatHandler);
		return () => {
			socket.off("clear chat", clearChatHandler);
		};
	});
	// socket delete chat messages
	useEffect(() => {
		const deleteChatHandler = (chatId) => {
			dispatch(setChatDetailsBox(false));
			if (selectedChat && chatId === selectedChat._id) {
				dispatch(addAllMessages([]));
			}
			dispatch(deleteSelectedChat(chatId));
			toast.success("Chat deleted successfully");
		};
		socket.on("delete chat", deleteChatHandler);
		return () => {
			socket.off("delete chat", deleteChatHandler);
		};
	});

	// socket chat created
	useEffect(() => {
		const chatCreatedHandler = (chat) => {
			dispatch(addNewChat(chat));
			toast.success("Created & Selected chat");
		};
		socket.on("chat created", chatCreatedHandler);
		return () => {
			socket.off("chat created", chatCreatedHandler);
		};
	});

	const handleLogout = () => {
		localStorage.removeItem("token")
		dispatch(logout()); // Dispatch logout action
		toast.success("Logged out successfully");
		navigate("/signin"); // Navigate to the home page
	};

	return (
		<div className="flex w-full  border rounded-sm shadow-md  relative">
			<div
				className={`${
					selectedChat && "hidden"
				} sm:block sm:w-[40%] w-full h-[90vh] bg-white text-black border-r border-slate-500 relative`}
			>
				<div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
					{/* Logout Button (Left Corner) */}
					<MdLogout
						title="Logout"
						fontSize={32}
						onClick={handleLogout} // Add logout handler
						className="cursor-pointer" // Add pointer cursor
					/>
					{/* New Chat Button (Right Corner) */}
					<MdChat
						title="New Chat"
						fontSize={32}
						onClick={() => dispatch(setUserSearchBox())}
						className="cursor-pointer" // Add pointer cursor
					/>
				</div>
				{isUserSearchBox ? <UserSearch /> : <MyChat />}
			</div>
			<div
				className={`${
					!selectedChat && "hidden"
				} sm:block sm:w-[60%] w-full h-[90vh] bg-white text-black relative overflow-hidden`}
			>
				{selectedChat ? (
					<MessageBox chatId={selectedChat?._id} />
				) : (
					<ChatNotSelected />
				)}
			</div>
		</div>
	);
};

export default Home;