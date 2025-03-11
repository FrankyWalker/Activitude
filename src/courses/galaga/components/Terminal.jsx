import React, { useState, useRef, useEffect } from 'react';
import './terminal_components/Terminal.css';

const RealTerminalComponent = ({ files = {}, initialFiles = [["main.rs", "Cargo.toml"]] }) => {
    const [terminals, setTerminals] = useState([{ id: 1, name: "Term", files: initialFiles[0] }]);
    const [activeTerminal, setActiveTerminal] = useState(1);
    const terminalRefs = useRef({});
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const [processRunning, setProcessRunning] = useState({});

    const [history, setHistory] = useState({});
    const [cursorPosition, setCursorPosition] = useState({});
    const [inputBuffer, setInputBuffer] = useState({});
    const [commandHistory, setCommandHistory] = useState({});
    const [historyIndex, setHistoryIndex] = useState({});


    const MAX_RECONNECT_ATTEMPTS = 5; // Maximum number of reconnection attempts
    const RECONNECT_INTERVAL_MS = 3000; // Interval between reconnect attempts (in milliseconds)
    const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

    useEffect(() => {
        const newHistory = { ...history };
        const newCursorPosition = { ...cursorPosition };
        const newInputBuffer = { ...inputBuffer };
        const newCommandHistory = { ...commandHistory };
        const newHistoryIndex = { ...historyIndex };
        const newProcessRunning = { ...processRunning };

        terminals.forEach(terminal => {
            if (!newHistory[terminal.id]) {
                newHistory[terminal.id] = [
                    { type: 'output', text: 'Welcome to the terminal!', className: 'terminal-welcome' },
                ];
                newCursorPosition[terminal.id] = 0;
                newInputBuffer[terminal.id] = '';
                newCommandHistory[terminal.id] = [];
                newHistoryIndex[terminal.id] = -1;
                newProcessRunning[terminal.id] = false;
            }
        });

        setHistory(newHistory);
        setCursorPosition(newCursorPosition);
        setInputBuffer(newInputBuffer);
        setCommandHistory(newCommandHistory);
        setHistoryIndex(newHistoryIndex);
        setProcessRunning(newProcessRunning);
    }, [terminals]);

    useEffect(() => {
        const connectWebSocket = () => {
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
                wsRef.current = new WebSocket('ws://localhost:8080');
                console.log('Attempting to connect to WebSocket...');
                setIsConnected(false);

                wsRef.current.onopen = () => {
                    console.log('Connected to WebSocket server');
                    setIsConnected(true);
                    setReconnectionAttempts(0); // Reset the reconnection attempts
                };

                wsRef.current.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.output) {
                        processOutputText(activeTerminal, data.output.trim());
                    } else if (data.error) {
                        addOutputToTerminal(activeTerminal, data.error.trim(), COLORS.ERROR);
                    } else if (data.status) {
                        if (
                            data.status.includes('Process exited') ||
                            data.status.includes('Rust process stopped')
                        ) {
                            setProcessRunning((prev) => ({ ...prev, [activeTerminal]: false }));
                        }
                        addOutputToTerminal(activeTerminal, data.status, COLORS.INFO);
                    }
                };

                wsRef.current.onclose = () => {
                    console.log('Disconnected from WebSocket server');
                    setIsConnected(false);
                    setProcessRunning({});
                    attemptReconnect();
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setIsConnected(false);
                    wsRef.current.close();
                };
            }
        };

        const attemptReconnect = () => {
            if (reconnectionAttempts < MAX_RECONNECT_ATTEMPTS) {
                setTimeout(() => {
                    console.log(`Reconnecting... Attempt ${reconnectionAttempts + 1}`);
                    setReconnectionAttempts((prev) => prev + 1);
                    connectWebSocket();
                }, RECONNECT_INTERVAL_MS);
            } else {
                console.error('Max reconnection attempts reached. Unable to reconnect.');
                setIsConnected(false);
                addOutputToTerminal(
                    activeTerminal,
                    'Failed to reconnect after multiple attempts.',
                    COLORS.ERROR
                );
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                setIsConnected(false);
            }
        };
    }, [activeTerminal]);
    const COLORS = {
        PROMPT: 'terminal-prompt',
        RUST_FILE: 'terminal-rust-file',
        TOML_FILE: 'terminal-toml-file',
        COMMAND: 'terminal-command',
        SUCCESS: 'terminal-success',
        ERROR: 'terminal-error',
        WELCOME: 'terminal-welcome',
        INFO: 'terminal-info',
        UPDATE: 'terminal-update',
    };

    const processOutputText = (terminalId, text) => {

        if (text.includes('Downloading') || text.includes('Installing') ||
            text.includes('Compiling') || text.includes('Adding') ||
            text.includes('Updating') || text.includes('Locking')) {


            const lines = text.split('\n');

            lines.forEach(line => {
                if (line.trim() === '') return;

                if (line.startsWith('Downloading') || line.startsWith('Installing') ||
                    line.startsWith('Compiling') || line.startsWith('Adding') ||
                    line.startsWith('Updating') || line.startsWith('Locking') ||
                    line.startsWith('Downloaded') || line.startsWith('Finished') ||
                    line.startsWith('Running')) {

                    const firstSpaceIndex = line.indexOf(' ');

                    if (firstSpaceIndex > 0) {
                        const action = line.substring(0, firstSpaceIndex);
                        const packageInfo = line.substring(firstSpaceIndex + 1);


                        setHistory(prev => {
                            const terminalHistory = [...(prev[terminalId] || [])];
                            terminalHistory.push({
                                type: 'installation',
                                action: action,
                                packageName: packageInfo
                            });
                            return { ...prev, [terminalId]: terminalHistory };
                        });
                    } else {
                        addOutputToTerminal(terminalId, line, COLORS.SUCCESS);
                    }
                } else {

                    addOutputToTerminal(terminalId, line);
                }
            });
        } else {
            addOutputToTerminal(terminalId, text, COLORS.SUCCESS);
        }

        setTimeout(() => {
            if (terminalRefs.current[terminalId]) {
                const element = terminalRefs.current[terminalId];
                element.scrollTop = element.scrollHeight;
            }
        }, 10);
    };

    const addOutputToTerminal = (terminalId, text, className = '') => {
        setHistory(prev => {
            const terminalHistory = [...(prev[terminalId] || [])];
            terminalHistory.push({ type: 'output', text, className });
            return { ...prev, [terminalId]: terminalHistory };
        });

        setTimeout(() => {
            if (terminalRefs.current[terminalId]) {
                const element = terminalRefs.current[terminalId];
                element.scrollTop = element.scrollHeight;
            }
        }, 10);
    };

    const addNewTerminal = () => {
        const newId = terminals.length > 0 ? Math.max(...terminals.map(t => t.id)) + 1 : 1;
        const fileSet = initialFiles[Math.min(terminals.length, initialFiles.length - 1)] || initialFiles[0];
        setTerminals([...terminals, { id: newId, name: `Term ${newId}`, files: fileSet }]);
        setActiveTerminal(newId);
    };

    const closeTerminal = (id, e) => {
        e.stopPropagation();
        if (terminals.length === 1) return;

        if (processRunning[id]) {
            stopProcess(id);
        }

        const newTerminals = terminals.filter(t => t.id !== id);
        setTerminals(newTerminals);

        if (activeTerminal === id) {
            setActiveTerminal(newTerminals[0].id);
        }

        setHistory(prev => {
            const newHistory = { ...prev };
            delete newHistory[id];
            return newHistory;
        });

        setCursorPosition(prev => {
            const newPos = { ...prev };
            delete newPos[id];
            return newPos;
        });

        setInputBuffer(prev => {
            const newBuffer = { ...prev };
            delete newBuffer[id];
            return newBuffer;
        });

        setCommandHistory(prev => {
            const newCmdHistory = { ...prev };
            delete newCmdHistory[id];
            return newCmdHistory;
        });

        setHistoryIndex(prev => {
            const newIndex = { ...prev };
            delete newIndex[id];
            return newIndex;
        });

        setProcessRunning(prev => {
            const newProcessRunning = { ...prev };
            delete newProcessRunning[id];
            return newProcessRunning;
        });
    };

    const switchTerminal = (id) => {
        setActiveTerminal(id);
        setTimeout(() => {
            if (terminalRefs.current[id]) {
                terminalRefs.current[id].focus();
            }
        }, 50);
    };

    const getFileColor = (filename) => {
        if (filename.endsWith('.rs')) {
            return COLORS.RUST_FILE;
        } else if (filename.endsWith('.toml')) {
            return COLORS.TOML_FILE;
        }
        return '';
    };

    const stopProcess = (terminalId) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                action: 'stop'
            }));
            addOutputToTerminal(terminalId, "^C", COLORS.ERROR);
        }
    };

    const processCommand = (terminalId, command) => {

        if (processRunning[terminalId]) {
            return;
        }

        const terminalObj = terminals.find(t => t.id === terminalId);
        const terminalFiles = terminalObj ? terminalObj.files : [];

        setCommandHistory(prev => {
            const newHistory = [...(prev[terminalId] || [])];
            if (command.trim()) {
                newHistory.push(command);
            }
            return { ...prev, [terminalId]: newHistory };
        });

        setHistoryIndex(prev => ({ ...prev, [terminalId]: -1 }));

        setHistory(prev => {
            const terminalHistory = [...(prev[terminalId] || [])];
            terminalHistory.push({ type: 'command', text: command, prompt: '$' });
            return { ...prev, [terminalId]: terminalHistory };
        });

        if (command === 'ls') {

            const fileOutput = terminalFiles.map(file => ({
                type: 'output',
                text: file,
                className: getFileColor(file)
            }));

            setHistory(prev => {
                const terminalHistory = [...(prev[terminalId] || []), ...fileOutput];
                return { ...prev, [terminalId]: terminalHistory };
            });
        }
        else if (command === 'clear') {

            setHistory(prev => ({ ...prev, [terminalId]: [] }));
        }
        else if (command === 'cargo run') {

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                const cargoToml = files['Cargo.toml'] || '';
                const mainRs = files['main.rs'] || '';

                wsRef.current.send(JSON.stringify({
                    cargoToml,
                    mainRs
                }));

                //  addOutputToTerminal(terminalId, "Running on server...", COLORS.INFO);
                setProcessRunning(prev => ({ ...prev, [terminalId]: true }));
            } else {
                // addOutputToTerminal(terminalId, "WebSocket connection not established.", COLORS.ERROR);
            }
        }
        else if (command.startsWith('cat ')) {

            const filename = command.substring(4).trim();
            if (terminalFiles.includes(filename)) {
                if (files[filename]) {
                    addOutputToTerminal(terminalId, `${filename}:`, getFileColor(filename));

                    files[filename].split('\n').forEach(line => {
                        addOutputToTerminal(terminalId, line);
                    });
                } else {
                    addOutputToTerminal(terminalId, `No content available for file: ${filename}`, COLORS.ERROR);
                }
            } else {
                addOutputToTerminal(terminalId, `No such file or directory: ${filename}`, COLORS.ERROR);
            }
        }
        else if (command === 'help') {

            addOutputToTerminal(terminalId, "Available commands:", COLORS.INFO);
            addOutputToTerminal(terminalId, "  ls            - List files");
            addOutputToTerminal(terminalId, "  cat <file>    - Show file contents");
            addOutputToTerminal(terminalId, "  cargo run     - Run the Rust program (executes on server)");
            addOutputToTerminal(terminalId, "  clear         - Clear the terminal");
            addOutputToTerminal(terminalId, "  help          - Show this help");
            addOutputToTerminal(terminalId, "  Ctrl+C        - Stop running process");
        }
        else if (command.trim() === '') {
        }
        else {
            addOutputToTerminal(terminalId, `Command not found: ${command}`, COLORS.ERROR);
        }

        setInputBuffer(prev => ({ ...prev, [terminalId]: '' }));

        setTimeout(() => {
            if (terminalRefs.current[terminalId]) {
                const element = terminalRefs.current[terminalId];
                element.scrollTop = element.scrollHeight;
            }
        }, 10);
    };

    const handleKeyDown = (terminalId, e) => {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();

            if (processRunning[terminalId]) {
                stopProcess(terminalId);
                return;
            } else {
                addOutputToTerminal(terminalId, "^C", COLORS.ERROR);
                setInputBuffer(prev => ({ ...prev, [terminalId]: '' }));
                return;
            }
        }


        if (processRunning[terminalId]) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        const cmdHistory = commandHistory[terminalId] || [];
        const index = historyIndex[terminalId] || -1;
        const buffer = inputBuffer[terminalId] || '';

        if (e.key === 'Enter') {
            processCommand(terminalId, buffer);
        }
        else if (e.key === 'ArrowUp') {
            if (cmdHistory.length > 0) {
                const newIndex = index === -1
                    ? cmdHistory.length - 1
                    : Math.max(0, index - 1);

                setHistoryIndex(prev => ({ ...prev, [terminalId]: newIndex }));
                setInputBuffer(prev => ({ ...prev, [terminalId]: cmdHistory[newIndex] }));

                setCursorPosition(prev => ({
                    ...prev,
                    [terminalId]: cmdHistory[newIndex].length
                }));
            }
        }
        else if (e.key === 'ArrowDown') {
            if (index !== -1) {
                const newIndex = index < cmdHistory.length - 1
                    ? index + 1
                    : -1;

                setHistoryIndex(prev => ({ ...prev, [terminalId]: newIndex }));

                const newCommand = newIndex === -1 ? '' : cmdHistory[newIndex];
                setInputBuffer(prev => ({ ...prev, [terminalId]: newCommand }));

                setCursorPosition(prev => ({
                    ...prev,
                    [terminalId]: newCommand.length
                }));
            }
        }
        else if (e.key === 'ArrowLeft') {
            setCursorPosition(prev => ({
                ...prev,
                [terminalId]: Math.max(0, (prev[terminalId] || 0) - 1)
            }));
        }
        else if (e.key === 'ArrowRight') {
            setCursorPosition(prev => ({
                ...prev,
                [terminalId]: Math.min(buffer.length, (prev[terminalId] || 0) + 1)
            }));
        }
        else if (e.key === 'Home') {
            setCursorPosition(prev => ({ ...prev, [terminalId]: 0 }));
        }
        else if (e.key === 'End') {
            setCursorPosition(prev => ({ ...prev, [terminalId]: buffer.length }));
        }
        else if (e.key === 'Backspace') {
            const pos = cursorPosition[terminalId] || 0;
            if (pos > 0) {
                const newBuffer = buffer.substring(0, pos - 1) + buffer.substring(pos);
                setInputBuffer(prev => ({ ...prev, [terminalId]: newBuffer }));
                setCursorPosition(prev => ({ ...prev, [terminalId]: pos - 1 }));
            }
        }
        else if (e.key === 'Delete') {
            const pos = cursorPosition[terminalId] || 0;
            if (pos < buffer.length) {
                const newBuffer = buffer.substring(0, pos) + buffer.substring(pos + 1);
                setInputBuffer(prev => ({ ...prev, [terminalId]: newBuffer }));
            }
        }
        else if (e.key === 'Tab') {
            if (buffer.startsWith('cat ')) {
                const partialFilename = buffer.substring(4).trim();
                const terminalObj = terminals.find(t => t.id === terminalId);
                const terminalFiles = terminalObj ? terminalObj.files : [];

                const matches = terminalFiles.filter(file =>
                    file.startsWith(partialFilename) && file !== partialFilename
                );

                if (matches.length === 1) {
                    const newBuffer = `cat ${matches[0]}`;
                    setInputBuffer(prev => ({ ...prev, [terminalId]: newBuffer }));
                    setCursorPosition(prev => ({ ...prev, [terminalId]: newBuffer.length }));
                }
            }
        }
        else if (e.key.length === 1) {
            const pos = cursorPosition[terminalId] || 0;
            const newBuffer = buffer.substring(0, pos) + e.key + buffer.substring(pos);
            setInputBuffer(prev => ({ ...prev, [terminalId]: newBuffer }));
            setCursorPosition(prev => ({ ...prev, [terminalId]: pos + 1 }));
        }
    };

    useEffect(() => {
        const terminalElement = terminalRefs.current[activeTerminal];
        if (terminalElement) {
            terminalElement.focus();
        }
    }, [activeTerminal]);

    return (
        <div className="container">
            <div className="terminal-header">
                <div className="terminal-icon-section">
                    <div className="terminal-icon-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}></div>
                    <div className="divider-line"></div>
                    <button className="add-button-wrapper" onClick={addNewTerminal} title="New Terminal">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="tabs-container">
                    {terminals.map(terminal => (
                        <div
                            key={terminal.id}
                            className={`tab ${terminal.id === activeTerminal ? 'active' : ''}`}
                            onClick={() => switchTerminal(terminal.id)}
                        >
                            <div className={`tab-inner ${terminal.id === activeTerminal ? 'active' : ''}`}>
                                <div className="terminal-tab-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className="tab-text">{terminal.name}</span>
                                {terminals.length > 1 && (
                                    <button
                                        className="close-button"
                                        onClick={(e) => closeTerminal(terminal.id, e)}
                                        title="Close Terminal"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="terminals-container">
                {terminals.map(terminal => {
                    const terminalId = terminal.id;
                    const terminalHistory = history[terminalId] || [];
                    const buffer = inputBuffer[terminalId] || '';
                    const cursorPos = cursorPosition[terminalId] || 0;
                    const isProcessRunning = processRunning[terminalId];

                    return (
                        <div
                            key={terminalId}
                            className={`terminal-wrapper ${terminalId === activeTerminal ? 'active' : ''}`}
                        >
                            <div
                                className="terminal-content"
                                ref={el => terminalRefs.current[terminalId] = el}
                                tabIndex={0}
                                onKeyDown={e => handleKeyDown(terminalId, e)}
                            >
                                {terminalHistory.map((item, index) => (
                                    <div key={index}>
                                        {item.type === 'command' ? (
                                            <div className="command-line">
                                                <span className="prompt">{item.prompt || '$'}</span>
                                                <span className={`command-text ${COLORS.COMMAND}`}>{item.text}</span>
                                            </div>
                                        ) : item.type === 'installation' ? (
                                            <div className="output-line">
                                                <span className="terminal-success">{item.action} </span>
                                                <span>{item.packageName}</span>
                                            </div>
                                        ) : (
                                            <div className={`output-line ${item.className}`}>
                                                {item.text}
                                            </div>
                                        )}
                                    </div>
                                ))}


                                {!isProcessRunning && (
                                    <div className="command-line">
                                        <span className="prompt">$</span>
                                        <div className="input-line">
                                            <span className={COLORS.COMMAND}>
                                                {buffer.substring(0, cursorPos)}
                                            </span>

                                            <span
                                                className={`cursor ${terminalId === activeTerminal ? 'active' : ''} ${COLORS.COMMAND}`}
                                            >
                                                {cursorPos < buffer.length ? buffer.charAt(cursorPos) : ' '}
                                            </span>

                                            <span className={COLORS.COMMAND}>
                                                {buffer.substring(cursorPos + 1)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RealTerminalComponent;