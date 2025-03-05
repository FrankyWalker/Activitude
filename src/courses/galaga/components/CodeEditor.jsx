import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import FileCodeIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import ReactDOM from "react-dom";

const CodeEditor = ({ onRun }) => {
    const defaultFiles = {
        "main.rs": "// Write your Rust code here\n\nfn main() {\n    println!(\"Hello, Rust!\");\n}",
        "Cargo.toml": '[package]\nname = "rust_project"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\n'
    };

    const [activeFile, setActiveFile] = useState("main.rs");
    const [files, setFiles] = useState(defaultFiles);
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: "",
        pos: { x: 0, y: 0 },
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const handleMouseEnter = (event, tooltipContent) => {
        const { top, left, width } = event.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            content: tooltipContent,
            pos: {
                x: left + width / 2 + window.scrollX,
                y: top - 40 + window.scrollY,
            },
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, content: "", pos: { x: 0, y: 0 } });
    };

    const handleRunClick = () => {
        if (isPlaying) {
            clearTimeout(timeoutId);
            setIsPlaying(false);
            return;
        }

        if (onRun) onRun(files["main.rs"], files["Cargo.toml"]);
        setIsPlaying(true);

        setShowFeedback(true);
        setFeedbackMessage("Running code...");

        const id = setTimeout(() => {
            setIsPlaying(false);
            setFeedbackMessage(`Code executed successfully!\n\nMain.rs:\n${files["main.rs"]}\n\nCargo.toml:\n${files["Cargo.toml"]}`);

            setTimeout(() => {
                setShowFeedback(false);
            }, 4000);
        }, 1500);

        setTimeoutId(id);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(files[activeFile]);
        setShowFeedback(true);
        setFeedbackMessage("Copied to clipboard!");

        setTimeout(() => {
            setShowFeedback(false);
        }, 1500);
    };

    const handleResetClick = () => {
        setFiles({ ...files, [activeFile]: defaultFiles[activeFile] });
        setShowFeedback(true);
        setFeedbackMessage("Code reset to default");

        setTimeout(() => {
            setShowFeedback(false);
        }, 1500);
    };

    const handleCodeChange = (value) => {
        setFiles({ ...files, [activeFile]: value });
    };

    const handleTabClick = (filename) => {
        setActiveFile(filename);
    };

    return (
        <EditorContainer>
            <FileTabs>
                <StaticFolderContainer>
                    <FolderIcon style={{ fontSize: '24px', opacity: 0.7 }} />
                </StaticFolderContainer>
                {Object.keys(files).map((filename) => (
                    <FileTab
                        key={filename}
                        active={activeFile === filename}
                        onClick={() => handleTabClick(filename)}
                    >
                        <FileIconWrapper>
                            <FileCodeIcon style={{ fontSize: '20px' }} />
                        </FileIconWrapper>
                        <span>{filename}</span>
                    </FileTab>
                ))}
            </FileTabs>

            <EditorContent>
                <CodeMirror
                    value={files[activeFile]}
                    extensions={activeFile === "main.rs" ? [rust()] : []}
                    theme={oneDark}
                    onChange={handleCodeChange}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                        overflowX: 'auto'
                    }}
                />
            </EditorContent>

            <ControlPanel>
                <ButtonGroup>
                    <RunButton
                        playing={isPlaying}
                        onMouseEnter={(e) => handleMouseEnter(e, activeFile === "main.rs" ? "Run code" : "Only main.rs can be executed")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleRunClick}
                        disabled={activeFile !== "main.rs"}
                    >
                        {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                    </RunButton>

                    <SecondaryButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Copy code")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleCopyClick}
                    >
                        <ContentCopyIcon />
                    </SecondaryButton>

                    <SecondaryButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Reset code")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleResetClick}
                    >
                        <ReplayIcon />
                    </SecondaryButton>
                </ButtonGroup>
            </ControlPanel>

            {showFeedback && (
                <FeedbackToast>
                    {feedbackMessage}
                </FeedbackToast>
            )}

            {tooltip.visible &&
                ReactDOM.createPortal(
                    <Tooltip style={{ top: tooltip.pos.y, left: tooltip.pos.x }}>
                        {tooltip.content}
                    </Tooltip>,
                    document.body
                )}
        </EditorContainer>
    );
};

export default CodeEditor;

// Styled Components
const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
    background-color: #1e1e2e;
    color: white;
`;

const FileTabs = styled.div`
    display: flex;
    background-color: #252535;
    padding: 0;
    overflow-x: auto;
    scrollbar-width: thin;
    align-items: center;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #4d4d69;
        border-radius: 4px;
    }
`;

const StaticFolderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #252535;
    color: #aaa;
    border-right: 1px solid #303042;
    width: 40px;
    height: 40px;
`;

const FileIconWrapper = styled.span`
    display: inline-flex;
    margin-right: 8px;
    opacity: 0.8;
`;

const FileTab = styled.div`
    padding: 12px 18px;
    background-color: ${(props) => (props.active ? "#1e1e2e" : "transparent")};
    color: ${(props) => (props.active ? "#f8f8f2" : "#aaa")};
    border-bottom: 3px solid ${(props) => (props.active ? "#6366f1" : "transparent")};
    cursor: pointer;
    font-size: 16px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    user-select: none;
    white-space: nowrap;

    &:hover {
        background-color: ${(props) => (props.active ? "#1e1e2e" : "#2a2a3f")};
        color: ${(props) => (props.active ? "#f8f8f2" : "#eee")};
    }
`;

const EditorContent = styled.div`
    flex: 1;
    width: 100%;
    background-color: #1e1e2e;
    overflow: hidden;
    position: relative;

    .cm-editor {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 16px;
        width: 100%;
        height: 100%;
    }
`;

const ControlPanel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 25px;
    background-color: #252535;
    border-top: 1px solid #303042;
    width: 100%;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
`;

const RunButton = styled.button`
    background-color: ${(props) => {
        if (props.disabled) return "#3b3b4f";
        return props.playing ? "#f43f5e" : "#6366f1";
    }};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

    &:hover:not(:disabled) {
        background-color: ${(props) => (props.playing ? "#e11d48" : "#4f46e5")};
        transform: translateY(-2px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    svg {
        font-size: 24px;
    }
`;

const SecondaryButton = styled.button`
    background-color: transparent;
    color: #aaa;
    border: none;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s, transform 0.1s;

    &:hover {
        background-color: rgba(255,255,255,0.1);
        color: #f8f8f2;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        font-size: 24px;
    }
`;

const Tooltip = styled.div`
    position: absolute;
    background: #3b3b4f;
    color: white;
    padding: 8px 12px;
    border-radius: 0;
    font-size: 14px;
    max-width: 250px;
    text-align: center;
    z-index: 1000;
    pointer-events: none;
    transform: translateX(-50%);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

    &:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -6px;
        border-width: 6px;
        border-style: solid;
        border-color: #3b3b4f transparent transparent transparent;
    }
`;

const FeedbackToast = styled.div`
    position: absolute;
    top: 25px;
    right: 25px;
    background-color: #6366f1;
    color: white;
    padding: 12px 20px;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
    animation: slideIn 0.3s ease-out forwards;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 100;

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
