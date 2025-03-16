import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { auth } from '../../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";
import TerminalIcon from "@mui/icons-material/Terminal";
import BashIcon from "@mui/icons-material/Terminal";

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

const EnhancedTerminal = () => {
    const terminalRef = useRef(null);
    const containerRef = useRef(null);
    const [terminalInstance, setTerminalInstance] = useState(null);
    // const executeCommand = async (command) => {
    //     if (!command) {
    //         console.error("Invalid command: command is null or undefined");
    //         return;
    //     }
    //
    //     // Ensure command is a string
    //     const commandStr = typeof command === 'string' ? command : String(command);
    //
    //     if (!userId) {
    //         console.error("User not authenticated. Cannot execute command.");
    //         if (terminalInstance) {
    //             terminalInstance.write(`\r\n\x1b[31mError: Not authenticated. Cannot execute ${commandStr}\x1b[0m\r\n`);
    //         }
    //         return;
    //     }
    //
    //     try {
    //         if (terminalInstance) {
    //             terminalInstance.write(`\r\n\x1b[33mExecuting: ${commandStr}\x1b[0m\r\n`);
    //         }
    //
    //         // Make a call to the new REST API endpoint
    //         const response = await fetch('http://localhost:3001/api/run-command', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 clientId: userId,
    //                 command: commandStr.trim()
    //             })
    //         });
    //
    //         const result = await response.json();
    //
    //         if (response.ok) {
    //             // Display standard output
    //             if (result.stdout && terminalInstance) {
    //                 terminalInstance.write(`${result.stdout}`);
    //             }
    //
    //             // Display errors if any
    //             if (result.stderr && terminalInstance) {
    //                 terminalInstance.write(`\x1b[31m${result.stderr}\x1b[0m`);
    //             }
    //
    //             // Display exit code
    //             if (terminalInstance) {
    //                 const exitCodeColor = result.exitCode === 0 ? '32' : '31'; // Green for success, red for failure
    //                 terminalInstance.write(`\r\n\x1b[${exitCodeColor}mCommand exited with code ${result.exitCode}\x1b[0m\r\n`);
    //             }
    //
    //             return result;
    //         } else {
    //             // Handle error response from the API
    //             console.error('Command execution failed:', result.error);
    //             if (terminalInstance) {
    //                 terminalInstance.write(`\r\n\x1b[31mError: ${result.error}\x1b[0m\r\n`);
    //                 if (result.details) {
    //                     terminalInstance.write(`\x1b[31m${result.details}\x1b[0m\r\n`);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         // Handle network or other errors
    //         console.error("Failed to execute command:", error);
    //         if (terminalInstance) {
    //             terminalInstance.write(`\r\n\x1b[31mNetwork error: Could not connect to server\x1b[0m\r\n`);
    //         }
    //     }
    // };


    const [fitAddonInstance, setFitAddonInstance] = useState(null);
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const [userId, setUserId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const reconnectionTimerRef = useRef(null);

    const darkBlue = "#0A1929";
    const redOrange = "#FF4500";
    const folderColor = "#36D399";
    const fileColor = "#6C63FF";
    const commandColor = "#FFD700";

    const handleResize = () => {
        if (fitAddonInstance && terminalInstance) {
            fitAddonInstance.fit();

            if (socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: 'resize',
                    cols: terminalInstance.cols,
                    rows: terminalInstance.rows
                }));
            }
        }
    };

    const connectWebSocket = () => {
        if (!userId) return;

        setIsConnecting(true); // Always start the loading animation
        const ws = new WebSocket("ws://localhost:3001");
        socketRef.current = ws;

        const connectionTimeout = setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                console.error("Connection timed out");
                ws.close(); // Force close if timeout occurs
            }
        }, 5000); // 5-second timeout

        ws.onopen = () => {
            console.log("Connected to terminal server");
            setSocket(ws);
            setIsConnecting(false); // Stop the loading animation on successful connection
            clearTimeout(connectionTimeout); // Clear timeout to avoid triggering it unnecessarily

            // Clear any existing reconnection timer
            if (reconnectionTimerRef.current) {
                clearInterval(reconnectionTimerRef.current);
                reconnectionTimerRef.current = null;
            }

            // Send initial connection details
            ws.send(
                JSON.stringify({
                    type: "connect",
                    uuid: userId,
                    cols: terminalInstance?.cols || 80,
                    rows: terminalInstance?.rows || 24,
                })
            );
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnecting(true); // Keep loading animation on error
        };

        ws.onclose = () => {
            console.log("Disconnected from terminal server");
            setSocket(null);
            setIsConnecting(true); // Always show loading while disconnected

            // Start reconnection process if not already running
            if (!reconnectionTimerRef.current) {
                console.log("Setting up reconnection timer");
                reconnectionTimerRef.current = setInterval(() => {
                    console.log("Attempting to reconnect...");
                    connectWebSocket();
                }, 3000); // Retry every 3 seconds
            }
        };
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User authenticated:", user.uid);
                setUserId(user.uid);
            } else {
                console.log("User not authenticated");
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }

            if (reconnectionTimerRef.current) {
                clearInterval(reconnectionTimerRef.current);
                reconnectionTimerRef.current = null;
            }
        };
    }, [userId, terminalInstance]);


    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
                .xterm .xterm-viewport::-webkit-scrollbar {
                    width: 8px !important;
                    background-color: ${darkBlue} !important;
                }
                .xterm .xterm-viewport::-webkit-scrollbar-thumb {
                    background-color: ${colors.scrollbarThumb} !important;
                    border-radius: 4px !important;
                }
                 .xterm .xterm-viewport {
                     scrollbar-width: thin !important;
                   scrollbar-color: ${colors.scrollbarThumb} ${darkBlue} !important;
                }
            `;
        document.head.appendChild(styleElement);

        if (terminalInstance) return;

        const initTimeout = setTimeout(() => {
            if (!terminalRef.current) return;

            const term = new Terminal({
                cursorBlink: true,
                fontSize: 16,
                fontFamily: '"Fira Code", Menlo, Monaco, "Courier New", monospace',
                theme: {
                    background: darkBlue,
                    foreground: "#A5B9FF",
                    cursor: redOrange,
                    cursorAccent: "#FFFFFF",
                    selection: "rgba(255, 69, 0, 0.3)",
                    black: "#000000",
                    red: "#FF4500",
                    green: folderColor,
                    yellow: commandColor,
                    blue: fileColor,
                    magenta: "#B14AFF",
                    cyan: "#38BDF8",
                    white: "#E0E0FF",
                    brightBlack: "#686868",
                    brightRed: "#FF5722",
                    brightGreen: "#4ADE80",
                    brightYellow: "#FFD700",
                    brightBlue: "#6C63FF",
                    brightMagenta: "#D946EF",
                    brightCyan: "#22D3EE",
                    brightWhite: "#FFFFFF",
                },
                allowTransparency: true,
                scrollback: 5000,
                smoothScrollDuration: 300,
                scrollSensitivity: 1,
            });

            const fit = new FitAddon();
            term.loadAddon(fit);

            term.open(terminalRef.current);
            fit.fit();

            setTerminalInstance(term);
            setFitAddonInstance(fit);

            term.onKey(({ key, domEvent }) => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        type: 'input',
                        data: key
                    }));
                }
            });

            term.focus();

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && userId) {
                socketRef.current.send(JSON.stringify({
                    type: 'connect',
                    uuid: userId,
                    cols: term.cols,
                    rows: term.rows
                }));
            }

            setTimeout(handleResize, 200);

        }, 100);

        return () => {
            clearTimeout(initTimeout);
            if (terminalInstance) {
                terminalInstance.dispose();
            }
        };
    }, [terminalInstance, userId]);


    useEffect(() => {
        if (!socket || !terminalInstance) return;

        const handleSocketMessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'output':
                        terminalInstance.write(message.data);
                        break;

                    case 'connected':
                        console.log(message.message);
                        console.log('Terminal ID:', message.terminalId);

                        terminalInstance.write(`\r\n\x1b[32mConnected to terminal server\x1b[0m\r\n`);
                        if (message.dockerCreated) {
                            terminalInstance.write(`\x1b[33mDocker container created for user: ${userId}\x1b[0m\r\n\r\n`);
                        } else {
                            terminalInstance.write(`\x1b[31mNo Docker container created. Please sign in to use Docker features.\x1b[0m\r\n\r\n`);
                        }
                        break;

                    case 'error':
                        console.error('Terminal error:', message.message, message.details);
                        terminalInstance.write(`\r\n\x1b[31mError: ${message.message}\x1b[0m\r\n`);
                        if (message.details) {
                            terminalInstance.write(`\x1b[31m${message.details}\x1b[0m\r\n`);
                        }
                        break;

                    case 'runOutput':
                        terminalInstance.write(`\r\n${message.output}`);
                        break;

                    case 'runError':
                        terminalInstance.write(`\r\n\x1b[31m${message.error}\x1b[0m`);
                        break;

                    case 'runStatus':
                        terminalInstance.write(`\r\n\x1b[33m${message.status}\x1b[0m\r\n`);
                        break;

                    default:
                        console.log('Unknown message type:', message.type);
                }
            } catch (err) {
                console.error('Failed to parse message:', err);
            }
        };

        socket.addEventListener('message', handleSocketMessage);

        return () => {
            socket.removeEventListener('message', handleSocketMessage);
        };
    }, [socket, terminalInstance, userId]);

    useEffect(() => {
        if (!fitAddonInstance || !containerRef.current) return;

        window.addEventListener("resize", handleResize);

        resizeObserverRef.current = new ResizeObserver(entries => {
            handleResize();
        });

        resizeObserverRef.current.observe(containerRef.current);

        const mutationObserver = new MutationObserver(handleResize);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        const resizeInterval = setInterval(handleResize, 1000);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            mutationObserver.disconnect();
            clearInterval(resizeInterval);
        };
    }, [fitAddonInstance, terminalInstance]);

    return (
        <StyledTerminalContainer>
            <FileTabs>
                <StaticFolderContainer>
                    <BashIcon style={{ fontSize: "24px", opacity: 0.7 }} />
                </StaticFolderContainer>
                <FileTab active={true}>
                    <FileIconWrapper>
                        <TerminalIcon style={{ fontSize: "20px" }} />
                    </FileIconWrapper>
                    <span>terminal</span>
                    {isConnecting && (
                        <ConnectingIndicator>
                            <LoadingDots>
                                <span></span>
                                <span></span>
                                <span></span>
                            </LoadingDots>
                            connecting
                        </ConnectingIndicator>
                    )}
                </FileTab>
            </FileTabs>

            <TerminalContent>

                <div
                    ref={containerRef}
                    className="w-full h-full"
                    style={{
                        background: darkBlue,
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        padding: "5px",
                        boxSizing: "border-box"
                    }}
                >
                    <div
                        ref={terminalRef}
                        className="w-full h-full"
                        style={{
                            width: "100%",
                            height: "100%",
                            padding: "0",
                            position: "relative",
                            overflow: "hidden",
                            filter: isConnecting ? "blur(1px)" : "none",
                            transition: "filter 0.3s ease"
                        }}
                    />
                    {isConnecting && (
                        <TerminalLoader>
                            <LoadingSpinner/>
                            <LoadingText>Connecting to terminal server...</LoadingText>
                        </TerminalLoader>
                    )}
                </div>
            </TerminalContent>
        </StyledTerminalContainer>
    );
};

export default EnhancedTerminal;


const StyledTerminalContainer = styled.div`
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

const TerminalContent = styled.div`
    flex: 1;
    width: 100%;
    background-color: ${colors.background};
    overflow: hidden;
    position: relative;
`;

const ConnectingIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6c757d;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid ${colors.panelBorder};
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;
  
  span {
    width: 4px;
    height: 4px;
    margin: 0 2px;
    background-color: #6c757d;
    border-radius: 50%;
    animation: loadingDots 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
  
  @keyframes loadingDots {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const TerminalLoader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(5, 10, 24, 0.7);
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 69, 0, 0.2);
  border-top: 3px solid ${colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;
