import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthState } from "./redux/slices/authSlice";

const AppWrapper = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(setAuthState(true));
        }
    }, [dispatch]);

    return null; // This component doesn't render anything
};

export default AppWrapper;