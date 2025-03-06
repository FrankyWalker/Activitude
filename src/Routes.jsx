import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import WelcomePage from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/Home";
import ScreenTooSmallPage from "./pages/ScreenTooSmallPage";
import IEDGalaga from "./courses/galaga/IEDGalaga";
import Playground from "./pages/Playground";

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 1000);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth < 1000);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isScreenSmall) {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<ScreenTooSmallPage />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={user ? <Navigate to="/home" /> : <WelcomePage />}
                />
                <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />
                <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUpPage />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/galagacourse"
                    element={
                        <PrivateRoute>
                            <IEDGalaga />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/playground" element={<Playground />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
