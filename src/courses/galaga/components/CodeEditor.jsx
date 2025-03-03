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
                y: top - 35 + window.scrollY,
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

        if (onRun) onRun(files["main.rs"]);
        setIsPlaying(true);

        setShowFeedback(true);
        setFeedbackMessage("Running code...");

        const id = setTimeout(() => {
            setIsPlaying(false);
            setFeedbackMessage("Code executed successfully!");

            setTimeout(() => {
                setShowFeedback(false);
            }, 2000);
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
                {Object.keys(files).map((filename) => (
                    <FileTab
                        key={filename}
                        active={activeFile === filename}
                        onClick={() => handleTabClick(filename)}
                    >
                        <FileIconWrapper>
                            <FileCodeIcon style={{ fontSize: '14px' }} />
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
                        {isPlaying ? (
                            <>
                                <StopIcon /> Stop
                            </>
                        ) : (
                            <>
                                <PlayArrowIcon /> Run
                            </>
                        )}
                    </RunButton>

                    <ActionButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Copy code")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleCopyClick}
                    >
                        <ContentCopyIcon fontSize="small" /> Copy
                    </ActionButton>

                    <ActionButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Reset code")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleResetClick}
                    >
                        <ReplayIcon fontSize="small" /> Reset
                    </ActionButton>
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

/* Styled Components with enhanced styling */
const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    background-color: #1e1e2e;
    color: white;
`;

const FileTabs = styled.div`
    display: flex;
    background-color: #252535;
    padding: 0;
    overflow-x: auto;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #4d4d69;
        border-radius: 4px;
    }
`;

const FileIconWrapper = styled.span`
    display: inline-flex;
    margin-right: 6px;
    opacity: 0.7;
`;

const FileTab = styled.div`
    padding: 10px 16px;
    background-color: ${(props) => (props.active ? "#1e1e2e" : "transparent")};
    color: ${(props) => (props.active ? "#f8f8f2" : "#aaa")};
    border-bottom: 2px solid ${(props) => (props.active ? "#6366f1" : "transparent")};
    cursor: pointer;
    font-size: 14px;
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
        font-size: 14px;
        width: 100%;
        height: 100%;
    }
    
    .cm-scroller {
        overflow: auto !important;
    }
    
    .cm-gutters {
        background-color: #282836;
    }
    
    /* Custom scrollbar styles */
    .cm-scroller::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    .cm-scroller::-webkit-scrollbar-track {
        background: #1e1e2e;
    }
    
    .cm-scroller::-webkit-scrollbar-thumb {
        background-color: #4d4d69;
        border-radius: 4px;
    }
    
    .cm-scroller::-webkit-scrollbar-thumb:hover {
        background-color: #6366f1;
    }
`;

const ControlPanel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background-color: #252535;
    border-top: 1px solid #303042;
    width: 100%;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionPrompt = styled.div`
    font-size: 14px;
    color: #aaa;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const RunButton = styled.button`
    background-color: ${(props) => {
        if (props.disabled) return "#3b3b4f";
        return props.playing ? "#f43f5e" : "#6366f1";
    }};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    transition: background-color 0.2s, transform 0.1s;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    &:hover:not(:disabled) {
        background-color: ${(props) => (props.playing ? "#e11d48" : "#4f46e5")};
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    svg {
        font-size: 18px;
    }
`;

const ActionButton = styled.button`
    background-color: #303045;
    color: #ddd;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    &:hover {
        background-color: #3b3b54;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        font-size: 16px;
    }
`;

const Tooltip = styled.div`
    position: absolute;
    background: #3b3b4f;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    max-width: 200px;
    text-align: center;
    z-index: 1000;
    pointer-events: none;
    transform: translateX(-50%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

    &:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #3b3b4f transparent transparent transparent;
    }
`;

const FeedbackToast = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #6366f1;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
