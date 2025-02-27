import React, { useEffect, useState } from "react";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
// import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSendLoading, setTyping } from "../../redux/slices/conditionSlice";
import {
	addNewMessage,
	addNewMessageId,
} from "../../redux/slices/messageSlice";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

let lastTypingTime;
const MessageSend = ({ chatId }) => {
	const [newMessage, setMessage] = useState("");
	const dispatch = useDispatch();
	const isSendLoading = useSelector(
		(store) => store?.condition?.isSendLoading
	);
	const isSocketConnected = useSelector(
		(store) => store?.condition?.isSocketConnected
	);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	useEffect(() => {
		socket.on("typing", () => dispatch(setTyping(true)));
		socket.on("stop typing", () => dispatch(setTyping(false)));
	}, []);

	// Send Message Api call
	const handleSendMessage = async () => {
		if (newMessage?.trim()) {
			const message = newMessage?.trim();
			setMessage("");
			socket.emit("stop typing", selectedChat._id);
			dispatch(setSendLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					message: message,
					chatId: chatId,
				}),
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addNewMessageId(json?.data?._id));
					dispatch(addNewMessage(json?.data));
					socket.emit("new message", json.data);
					dispatch(setSendLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setSendLoading(false));
					toast.error("Message Sending Failed");
				});
		}
	};

	const handleTyping = (e) => {
		setMessage(e.target?.value);
		if (!isSocketConnected) return;
		if (!isTyping) {
			socket.emit("typing", selectedChat._id);
		}
		lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		let stopTyping = setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff > timerLength) {
				socket.emit("stop typing", selectedChat._id);
			}
		}, timerLength);
		return () => clearTimeout(stopTyping);
	};

	return (
		<>
			<form
				className="w-full flex items-center gap-1 h-[7vh] bg-white text-black"
				onSubmit={(e) => e.preventDefault()}
			>
				<input
					type="text"
					className="outline-none p-2 w-full bg-transparent border-t-1"
					placeholder="Type a message"
					value={newMessage}
					onChange={(e) => handleTyping(e)}
				/>
				<span className="flex justify-center items-center">
					{newMessage?.trim() && !isSendLoading && (
						<button
							className="outline-none p-2 border-slate-500 "
							onClick={handleSendMessage}
						>
							<FaPaperPlane
								title="Send"
								size={18}
								className="active:scale-75 hover:text-green-400"
							/>
						</button>
					)}
					{isSendLoading && (
						<button className="outline-none p-2 border-slate-500 border-l">
							<LuLoader
								title="loading..."
								fontSize={18}
								className="animate-spin"
							/>
						</button>
					)}
				</span>
			</form>
		</>
	);
};

export default MessageSend;