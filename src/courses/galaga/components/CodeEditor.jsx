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

const colors = {
    primary: "#f4a300",
    secondary: "#d76a00",
    background: "#1a1f29",
    panelBackground: "#2a323e",
    panelBorder: "#34404e",
    textPrimary: "#e0e0e0",
    textSecondary: "#b0b0b0",
    tooltipBackground: "#2b3540",
    tooltipArrow: "#2b3540",
    scrollbarThumb: "#3e4a59",
    hover: "#3a4a60",
    disabled: "#3a4a60",
    disabledText: "#777",
    activeTabBorder: "#f4a300",
    activeTabBackground: "#2a323e",
};

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

        const id = setTimeout(() => {
            setIsPlaying(false);
        }, 1500);

        setTimeoutId(id);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(files[activeFile]);
    };

    const handleResetClick = () => {
        setFiles({ ...files, [activeFile]: defaultFiles[activeFile] });
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


const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
    background-color: ${colors.background};
    color: ${colors.textPrimary};
`;

const FileTabs = styled.div`
    display: flex;
    background-color: ${colors.panelBackground};
    padding: 0;
    overflow-x: auto;
    scrollbar-width: thin;
    align-items: center;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${colors.scrollbarThumb};
        border-radius: 4px;
    }
`;

const StaticFolderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.panelBackground};
    color: ${colors.textSecondary};
    border-right: 1px solid ${colors.panelBorder};
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
    background-color: ${(props) => (props.active ? colors.activeTabBackground : "transparent")};
    color: ${(props) => (props.active ? colors.textPrimary : colors.textSecondary)};
    border-bottom: 3px solid ${(props) => (props.active ? colors.activeTabBorder : "transparent")};
    cursor: pointer;
    font-size: 16px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    user-select: none;
    white-space: nowrap;

    &:hover {
        background-color: ${(props) => (props.active ? colors.activeTabBackground : colors.hover)};
        color: ${(props) => (props.active ? colors.textPrimary : colors.textSecondary)};
    }
`;

const EditorContent = styled.div`
    flex: 1;
    width: 100%;
    background-color: ${colors.background};
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
    background-color: ${colors.panelBackground};
    border-top: 1px solid ${colors.panelBorder};
    width: 100%;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
`;

const RunButton = styled.button`
    background-color: ${(props) => (props.disabled ? colors.disabled : props.playing ? colors.secondary : colors.primary)};
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
    color: ${colors.textSecondary};
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
        color: ${colors.textPrimary};
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
    background: ${colors.tooltipBackground};
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
        border-color: ${colors.tooltipArrow} transparent transparent transparent;
    }
`;
