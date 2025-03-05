import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleSignIn } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) navigate("/home");
    }, [user, navigate]);

    const handleGoogleSignIn = () => {
        dispatch(googleSignIn());
    };

    const handleEmailSignIn = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
                color: "white",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >

            <button
                onClick={() => navigate("/")}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    color: "white",
                    fontSize: "20px",
                    padding: "10px 15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.transform = "scale(1)";
                }}
            >
                ⬅
            </button>

            <div
                style={{
                    width: "90%",
                    maxWidth: "400px",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "50px",
                        fontWeight: "bold",
                        marginBottom: "90px",
                    }}
                >
                    Log In
                </h1>

                {loading && <p style={{ color: "gray" }}>Signing in...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        border: "1px solid white",
                        borderRadius: "5px",
                        backgroundColor: "black",
                        color: "white",
                        fontSize: "16px",
                        boxSizing: "border-box",
                    }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        border: "1px solid white",
                        borderRadius: "5px",
                        backgroundColor: "black",
                        color: "white",
                        fontSize: "16px",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    onClick={handleEmailSignIn}
                    disabled={loading}
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        color: "black",
                        border: "none",
                        padding: "12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        opacity: loading ? 0.7 : 1,
                        marginBottom: "15px",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0";
                        e.target.style.boxShadow =
                            "0 4px 6px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.boxShadow =
                            "0 2px 4px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    {loading ? "Signing in..." : "Log In with Email"}
                </button>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        color: "black",
                        border: "none",
                        padding: "12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0";
                        e.target.style.boxShadow =
                            "0 4px 6px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.boxShadow =
                            "0 2px 4px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Logo"
                        style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "10px",
                        }}
                    />
                    {loading ? "Signing in..." : "Log In with Google"}
                </button>

                <div style={{ marginTop: "20px" }}>
                    <p style={{ color: "white", fontSize: "14px" }}>
                        Don't have an account?{" "}
                        <span
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
