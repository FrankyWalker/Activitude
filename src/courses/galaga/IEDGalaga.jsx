import React, { useState, useEffect } from "react";
import Instructions from "./components/Instruction";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Terminal";
import AppBarCourse from "./components/AppBarCourse";
import BottomBar from "./components/BottomBar";

const IEDGalaga = () => {
    const [instructionsWidth, setInstructionsWidth] = useState(450);
    const [outputWidth, setOutputWidth] = useState(450);
    const [isResizingInstruction, setIsResizingInstruction] = useState(false);
    const [isResizingOutput, setIsResizingOutput] = useState(false);
    const [files, setFiles] = useState({
        "main.rs": "// Write your Rust code here\n\nfn main() {\n    println!(\"Hello, Rust!\");\n}",
        "Cargo.toml": "[package]\nname = \"rust_project\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[dependencies]\n",
    });


    const handleMouseMove = (e) => {
        if (isResizingInstruction) {
            const newWidth = Math.min(500, Math.max(300, e.clientX));
            setInstructionsWidth(newWidth);
        }

        if (isResizingOutput) {
            const calculatedWidth = window.innerWidth - e.clientX;
            const newOutputWidth = Math.min(700, Math.max(300, calculatedWidth));
            setOutputWidth(newOutputWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizingInstruction(false);
        setIsResizingOutput(false);
    };


    useEffect(() => {
        if (isResizingInstruction || isResizingOutput) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizingInstruction, isResizingOutput]);


    const handleFilesChange = (updatedFiles) => {

        console.log("Updated files state:", updatedFiles);

        setFiles(updatedFiles);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                background: "black",
                overflow: "hidden",
            }}
        >

            <AppBarCourse style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }} />

            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "calc(100% - 64px - 60px)",
                    marginTop: "80px",
                    marginBottom: "64px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${instructionsWidth}px`,
                        minWidth: "300px",
                        height: "100%",
                        display: "flex",
                        backgroundColor: "#1e1e1e",
                        borderRight: "1px solid #333",
                        flexShrink: 0,
                    }}
                >
                    <Instructions content="Step-by-step instructions for the user." />
                </div>

                <div
                    onMouseDown={() => setIsResizingInstruction(true)}
                    style={{
                        width: "5px",
                        cursor: "col-resize",
                        backgroundColor: "#333",
                        zIndex: 10,
                    }}
                ></div>

                <div
                    style={{
                        flex: "1",
                        position: "relative",
                        backgroundColor: "#222",
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    <CodeEditor onFilesChange={handleFilesChange} files={files} />

                    <div
                        onMouseDown={() => setIsResizingOutput(true)}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "5px",
                            height: "100%",
                            cursor: "col-resize",
                            backgroundColor: "#333",
                            zIndex: 20,
                        }}
                    ></div>
                </div>

                <div
                    style={{
                        width: `${outputWidth}px`,
                        minWidth: "300px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#1e1e1e",
                        borderLeft: "1px solid #333",
                        flexShrink: 0,
                    }}
                >
                    <Output files={files} initialFiles={[Object.keys(files)]} />
                </div>
            </div>

            <BottomBar status={{ status: "Ready", warnings: "0", errors: "0" }} />
        </div>
    );
};

export default IEDGalaga;