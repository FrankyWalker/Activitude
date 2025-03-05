import React, { useState, useEffect } from "react";

const ScreenTooSmallPage = () => {
    const [displayedText, setDisplayedText] = useState("");
    const message = "Your screen width is too small, please use your laptop 😢";

    useEffect(() => {
        let currentIndex = 0;

        const typeCharacter = () => {
            if (currentIndex < message.length) {

                setDisplayedText((prevText) => prevText + (message[currentIndex] || ""));
                currentIndex++;

                setTimeout(typeCharacter, 100);
            }
        };

        typeCharacter();

        return () => {

            currentIndex = message.length;
        };
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                background: "black",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "monospace",
                paddingLeft: "20px",
                paddingRight: "20px",
                boxSizing: "border-box",
            }}
        >

            <div
                style={{
                    border: "1px solid white",
                    padding: "10px 15px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontSize: "12px",
                    whiteSpace: "pre",
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

            <span
                style={{
                    fontSize: "18px",
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