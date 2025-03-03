import React, { useState, useEffect } from "react";

const ScreenTooSmallPage = () => {
    const [displayedText, setDisplayedText] = useState(""); // State for the text being displayed
    const message = "Your screen width is too small, please use your laptop 😢"; // The message to type out

    useEffect(() => {
        let currentIndex = 0; // Tracks the current character to type

        const typeCharacter = () => {
            if (currentIndex < message.length) {
                // Add the next character to the displayed text only if valid
                setDisplayedText((prevText) => prevText + (message[currentIndex] || ""));
                currentIndex++; // Move to the next character

                // Schedule the next character typing
                setTimeout(typeCharacter, 100);
            }
        };

        // Start typing effect
        typeCharacter();

        return () => {
            // Cleanup to stop typing if the component unmounts
            currentIndex = message.length;
        };
    }, []); // Empty dependency array to run effect only once on mount

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                background: "black", // Solid black background
                color: "white", // White text for contrast
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "monospace", // Monospace font for ASCII art
                paddingLeft: "20px",
                paddingRight: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* ASCII Art */}
            <div
                style={{
                    border: "1px solid white",
                    padding: "10px 15px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontSize: "12px",
                    whiteSpace: "pre", // Preserve spacing in ASCII art
                }}
            >
                {`           ,-.
           | |
           | |
  ,-"""""""-.|
 /  __:::__()\\
J ."_______". L
JJ,"       ".LL
|J|Phones do|L|
|||not work |||
L||at this  ||J
LJ|moment.  |LJ
LJ._________,LJ
L ___     ___ J
| \\__)---(__/ |
J----(===)----L
 L\\ "-___-" /J
 | "-------" |
 |           |
 |           |
 |           |
 |           |
 |           |
 |           |
 |           |
 |           |
 |    ...    |
 "-----------"`}
            </div>
            {/* Typing Effect Text */}
            <span
                style={{
                    fontSize: "18px", // Adjust font size for better readability
                    textAlign: "center",
                    padding: "0 10px",
                }}
            >
                {displayedText}
            </span>
        </div>
    );
};

export default ScreenTooSmallPage;