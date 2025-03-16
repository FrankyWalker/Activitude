import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { json } from "@codemirror/lang-json";
import { materialDark } from '@uiw/codemirror-theme-material';
import { EditorView } from "@codemirror/view";
import FileCodeIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

const colors = {
    primary: "#ff4500",
    secondary: "#ff6633",
    background: "#050a18",
    panelBackground: "#0a1428",
    editorBackground: "#050a18",
    panelBorder: "#15243b",
    textPrimary: "#e0e0e0",
    textSecondary: "#a0a0a0",
    scrollbarThumb: "#253656",
    hover: "#132039",
    activeTabBorder: "#ff4500",
    activeTabBackground: "#0a1428",
};

const customThemeExtension = EditorView.theme({
    "&": {
        backgroundColor: colors.editorBackground + " !important",
        height: "100%"
    },
    ".cm-content": {
        color: colors.textPrimary
    },
    ".cm-gutters": {
        backgroundColor: colors.panelBackground + " !important",
        color: colors.textSecondary,
        border: "none",
        minWidth: "30px",
    },
    ".cm-lineNumbers": {
        minWidth: "30px"
    },
    ".cm-activeLine": {
        backgroundColor: colors.hover + "40 !important"
    },
    ".cm-activeLineGutter": {
        backgroundColor: colors.hover + " !important"
    },
    ".cm-selectionBackground": {
        backgroundColor: colors.primary + "40 !important"
    },
    ".cm-cursor": {
        borderLeftColor: colors.primary + " !important"
    },
    ".cm-scroller": {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "16px"
    },
    ".cm-line": {
        color: colors.textPrimary + " !important"
    },
    ".cm-gutterElement": {
        color: colors.textSecondary + " !important",
        padding: "0 0px 0 5px"
    }
});

const CodeEditor = ({ onFilesChange, clientUUID }) => {
    const defaultFiles = {
        "src/main.rs": "// Write your Rust code here\n\nfn main() {\n    println!(\"Hello, Rust!\");\n}",
        "Cargo.toml": "[package]\nname = \"rust_project\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[dependencies]\n"
    };

    const clientId = useRef(null);
    useEffect(() => {
        import("firebase/auth").then(({ getAuth }) => {
            const auth = getAuth();
            if (auth.currentUser) {
                clientId.current = auth.currentUser.uid;
            } else {
                console.warn("No authenticated user found. ");
            }
        });
    }, [clientUUID]);

    const [activeFile, setActiveFile] = useState("src/main.rs");
    const [files, setFiles] = useState(defaultFiles);
    const [wsInstance, setWsInstance] = useState(null);
    const [status, setStatus] = useState("Connecting...");
    const [isConnected, setIsConnected] = useState(false);

    const debounceTimerRef = useRef(null);

    const reconnectTimeoutRef = useRef(null);
    const maxReconnectDelay = 5000;
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new WebSocket("ws://localhost:3001");
            setWsInstance(socket);

            socket.onopen = () => {
                console.log("WebSocket connection established.");
                setStatus("Connected. Initializing workspace...");
                reconnectAttempts.current = 0;
                setIsConnected(true);

                socket.send(JSON.stringify({
                    type: "connect",
                    uuid: clientId.current
                }));
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Received message:", data);

                    switch(data.type) {
                        case 'connected':
                            setStatus(`Connected to ${data.isExistingContainer ? '' : 'new'} workspace`);
                            break;

                        case 'status':
                            setStatus(data.message);
                            break;

                        case 'fileChanged':
                            setFiles(prevFiles => ({
                                ...prevFiles,
                                [data.file]: data.content
                            }));
                            break;

                        case 'fileUpdated':
                            console.log(`File ${data.file} updated successfully`);
                            break;

                        case 'error':
                            console.error("Server error:", data.message, data.details);
                            setStatus(`Error: ${data.message}`);
                            break;
                    }
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            };

            socket.onclose = (event) => {
                console.log("WebSocket connection closed:", event);
                setIsConnected(false);
                setStatus("Disconnected from server");

                if (!event.wasClean) {
                    const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts.current), maxReconnectDelay);
                    console.log(`Attempting to reconnect in ${delay}ms...`);

                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }

                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current++;
                        connectWebSocket();
                    }, delay);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                setStatus("Connection error");
            };
        };

        connectWebSocket();

        return () => {
            if (wsInstance) {
                wsInstance.close();
            }

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleCodeChange = (value) => {
        const updatedFiles = { ...files, [activeFile]: value };
        setFiles(updatedFiles);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            sendFileUpdate(activeFile, value);

            if (onFilesChange) {
                onFilesChange(updatedFiles);
            }
        }, 500);
    };

    const sendFileUpdate = (filename, content) => {
        if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not connected, can't send file updates");
            return;
        }

        if (filename === "src/main.rs" || filename === "Cargo.toml") {
            const updateType = {
                "src/main.rs": "mainRs",
                "Cargo.toml": "cargoToml"
            }[filename];

            wsInstance.send(JSON.stringify({
                type: "updateFile",
                [updateType]: content
            }));
        }
    };

    const handleTabClick = (filename) => {
        setActiveFile(filename);
    };

    const getLanguageExtension = (filename) => {
        if (filename.endsWith('.rs')) return rust();
        if (filename.endsWith('.toml')) return json();
        return [];
    };

    return (
        <StyledEditorContainer>
            <StatusBar>
                <StatusText>
                    <StatusIndicator connected={isConnected} />
                    {status}
                </StatusText>
            </StatusBar>

            <FileTabs>
                <StaticFolderContainer>
                    <FolderIcon style={{ fontSize: "24px", opacity: 0.7 }} />
                </StaticFolderContainer>
                {Object.keys(files).map((filename) => (
                    <FileTab
                        key={filename}
                        active={activeFile === filename}
                        onClick={() => handleTabClick(filename)}
                    >
                        <FileIconWrapper>
                            <FileCodeIcon style={{ fontSize: "20px" }} />
                        </FileIconWrapper>
                        <span>{filename}</span>
                    </FileTab>
                ))}
            </FileTabs>

            <EditorContent>
                <CodeMirror
                    value={files[activeFile]}
                    extensions={[
                        getLanguageExtension(activeFile),
                        customThemeExtension
                    ].flat()}
                    onChange={handleCodeChange}
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: colors.editorBackground
                    }}
                    theme={materialDark}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        syntaxHighlighting: true,
                        foldGutter: true,
                        autocompletion: true
                    }}
                />
            </EditorContent>
        </StyledEditorContainer>
    );
};

export default CodeEditor;

const StyledEditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
    background-color: ${colors.background};
    color: ${colors.textPrimary};
    border-radius: 6px;
`;

const StatusBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 36px;
    background-color: ${colors.panelBackground};
    border-bottom: 1px solid ${colors.panelBorder};
`;

const StatusText = styled.span`
    color: ${colors.textSecondary};
    font-size: 14px;
    display: flex;
    align-items: center;
`;

const StatusIndicator = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${props => props.connected ? '#4CAF50' : '#F44336'};
`;

const FileTabs = styled.div`
    display: flex;
    background-color: ${colors.panelBackground};
    padding: 0;
    overflow-x: auto;
    scrollbar-width: thin;
    align-items: center;
    border-bottom: 1px solid ${colors.panelBorder};

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
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    user-select: none;
    white-space: nowrap;

    &:hover {
        background-color: ${(props) => (props.active ? colors.activeTabBackground : colors.hover)};
        color: ${colors.textPrimary};
    }
`;

const EditorContent = styled.div`
    flex: 1;
    width: 100%;
    background-color: ${colors.background};
    overflow: hidden;
    position: relative;

    .cm-editor {
        background-color: ${colors.editorBackground} !important;
        color: ${colors.textPrimary} !important;
    }

    .cm-scroller {
        background-color: ${colors.editorBackground} !important;
    }

    .cm-content {
        background-color: ${colors.editorBackground} !important;
        color: ${colors.textPrimary} !important;
    }

    .cm-line {
        color: ${colors.textPrimary} !important;
    }

    .cm-gutters {
        background-color: ${colors.panelBackground} !important;
        border-right: 1px solid ${colors.panelBorder} !important;
    }
`;