import React, { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Error from "./pages/Error";
import AppWrapper from "./AppWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import Loading from "./components/loading/Loading";

const Applayout = () => {
    const [toastPosition, setToastPosition] = useState("bottom-left");
    const isLoading = useSelector((store) => store.condition.isLoading);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 600) {
                setToastPosition("bottom-left");
            } else {
                setToastPosition("top-left");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <ToastContainer
                position={toastPosition}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                stacked
                limit={3}
                toastStyle={{
                    border: "1px solid #dadadaaa",
                    textTransform: "capitalize",
                }}
            />
            <div className="bg-blue-300 h-screen p-10">
                <Outlet />
            </div>
            {isLoading && <Loading />}
        </div>
    );
};

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Applayout />,
        children: [
            {
                path: "/",
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                ],
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/signin",
                element: <SignIn />,
            },
            {
                path: "*",
                element: <Error />,
            },
        ],
        errorElement: <Error />,
    },
]);

function App() {

    return (
        <Provider store={store}>
            <AppWrapper />
            <RouterProvider router={routers} />
        </Provider>
    );
}

export default App;