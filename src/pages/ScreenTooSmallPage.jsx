import React, { useState, useEffect } from "react";
import wogo from "../assets/wogo.png";

const ScreenTooSmallPage = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const message = "Activitude's editor and terminal features are not supported on phone-sized screens.";
    const subMessage = "Please switch to a laptop or desktop device for full functionality.";

    useEffect(() => {
        let currentIndex = 0;
        let typingInterval;

        const typeCharacter = () => {
            if (currentIndex < message.length) {
                const char = message[currentIndex];
                if (char !== undefined) {
                    setDisplayedText((prevText) => prevText + char);
                }
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        };

        typingInterval = setInterval(typeCharacter, 70);

        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        // Cleanup intervals when component is unmounted
        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                background: "#0a192f",
                color: "#e6f1ff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Courier New', monospace",
                padding: "20px",
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
            }}
        >

            <img
                src={wogo}
                alt="Logo"
                style={{
                    position: "absolute",
                    top: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "100px",
                }}
            />

            <div className="code-background">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="code-line"
                        style={{
                            position: "absolute",
                            color: "rgba(64, 134, 244, 0.15)",
                            fontSize: "12px",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.7,
                        }}
                    >
                        {["function()", "if(screen.width", "<div>", "npm start", "git push", "const app", "export default", "return()", ".container{", "addEventListener"][i % 10]}
                    </div>
                ))}
            </div>

            <div
                style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "left",
                    marginBottom: "16px",
                    color: "#4086f4",
                    letterSpacing: "0.5px",
                    maxWidth: "90%",
                }}
            >
                <span>{displayedText}</span>
                <span
                    style={{
                        opacity: showCursor ? 1 : 0,
                        color: "#ff5e62",
                        marginLeft: "2px",
                    }}
                >
                    |
                </span>
            </div>

            <div
                style={{
                    fontSize: "16px",
                    textAlign: "center",
                    marginBottom: "30px",
                    color: "#8892b0",
                    maxWidth: "85%",
                }}
            >
                {subMessage}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "40px",
                    marginTop: "20px",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        opacity: 0.7,
                    }}
                >
                    <svg
                        width="40"
                        height="70"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="7"
                            y="3"
                            width="10"
                            height="18"
                            rx="2"
                            stroke="#8892b0"
                            strokeWidth="1.5"
                        />
                        <line
                            x1="7"
                            y1="7"
                            x2="17"
                            y2="7"
                            stroke="#8892b0"
                            strokeWidth="1.5"
                        />
                        <line
                            x1="7"
                            y1="17"
                            x2="17"
                            y2="17"
                            stroke="#8892b0"
                            strokeWidth="1.5"
                        />
                        <circle cx="12" cy="19" r="1" fill="#8892b0" />
                        <line
                            x1="5"
                            y1="5"
                            x2="19"
                            y2="19"
                            stroke="#ff5e62"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div
                        style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            color: "#ff5e62",
                            textAlign: "center",
                        }}
                    >
                        Not compatible
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        animation: "float 3s infinite ease-in-out",
                    }}
                >
                    <svg
                        width="80"
                        height="70"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 6.5C2 5.39543 2.89543 4.5 4 4.5H20C21.1046 4.5 22 5.39543 22 6.5V15.5C22 16.6046 21.1046 17.5 20 17.5H4C2.89543 17.5 2 16.6046 2 15.5V6.5Z"
                            stroke="#4086f4"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M8 20.5L16 20.5"
                            stroke="#4086f4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M12 17.5L12 20.5"
                            stroke="#4086f4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <rect
                            x="4"
                            y="6.5"
                            width="16"
                            height="9"
                            fill="rgba(64, 134, 244, 0.1)"
                        />
                    </svg>
                    <div
                        style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            color: "#4086f4",
                            textAlign: "center",
                        }}
                    >
                        Activitude works here
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                
                .code-line {
                    animation: fade 8s infinite linear;
                }
                
                @keyframes fade {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                `}
            </style>
        </div>
    );
};

export default ScreenTooSmallPage;