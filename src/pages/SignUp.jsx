import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		// Signup ---
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				phone: phone,
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};
	const handleSignup = (e) => {
		if (username && phone && email && password) {
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-col justify-center items-center text-black min-h-[80vh]">
			<div className="p-3 bg-white w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] shadow-2xl rounded-lg h-fit  mt-5 transition-all">
			<div className="flex justify-end">
                    <div style={{
                        width: "40px",
                        height: "40px",
                        backgroundImage: "radial-gradient(circle, black 1px, transparent 1px)",
                        backgroundSize: "10px 10px"
                    }}>
                    </div>
                </div>
				<span className="flex justify-center">
					<img src="https://s3-alpha-sig.figma.com/img/2251/bcc1/90c79d5b9c428484581b2a811dd92aa7?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ldACfoaBwSqFjjaL6JQ9avJCRmY93xqFqMHzylDTOHhQy21erEs8FhTReXkSbo-PEde2LZE5uUw1DDbD8B3Mf617lCfM3DbJgkcuOAIKDJmFU1Mms7XmS9a8weKYpNQi~5TPJSDHm5qpTJzlVeoH~lO6~9Sno7hKopt0PFq0MjEK14FwRLcgzAabFWD33nZKC0l0WfhX7RTWmHvC1ABELbsxxWSxWFPz-QpnjjstuqJGoQNu4YOcuuJx2lVy-fR~5KbT1Kptszddml~kPTHSTwarIv9fuk0PiWIDlRDQDakjIuqmnQpBqZtydh6-4d-n4FNgo8PIS7c7O7bduqW8yA__" alt="" className="h-[10vh]"/>
				</span>
				
				<form className="w-full flex justify-between flex-col">
					
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-xl flex justify-between bg-white text-black "
						type="text"
						placeholder="Enter User Name"
						name="firstName"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-xl flex justify-between bg-white text-black "
						type="text"
						placeholder="Enter Phone"
						name="phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-xl flex justify-between bg-white text-black "
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<div className="relative">
						<input
							className="w-full border border-slate-700 my-3 py-4 px-8 rounded-xl flex justify-between bg-white text-black "
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-black/80 absolute right-5 top-8"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-black rounded-xl px-5 py-4 mt-5 text-lg border border-slate-400  text-slate-400 hover:text-white bg-slate-700 transition-all"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] bg-slate-600"></div>
						<Link to="/signin">
							<div className="p-3 font-semibold text-md ">
								SignIn
							</div>
						</Link>
						<div className="w-full h-[1px] bg-slate-600"></div>
					</div>
				</form>
				<div className="flex justify-start">
                    <div style={{
                        width: "40px",
                        height: "40px",
                        backgroundImage: "radial-gradient(circle, black 1px, transparent 1px)",
                        backgroundSize: "10px 10px"
                    }}>
                    </div>
                </div>
			</div>
		</div>
	);
};

export default SignUp;