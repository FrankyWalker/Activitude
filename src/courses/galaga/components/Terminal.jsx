import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const RealTerminalComponent = ({ files = {}, initialFiles = [["main.rs", "Cargo.toml"]] }) => {
    const [terminals, setTerminals] = useState([{ id: 1, name: "Term", files: initialFiles[0] }]);
    const [activeTerminal, setActiveTerminal] = useState(1);
    const terminalRefs = useRef({});
    const wsRef = useRef(null);

    const [processRunning, setProcessRunning] = useState({});

    const [history, setHistory] = useState({});
    const [cursorPosition, setCursorPosition] = useState({});
    const [inputBuffer, setInputBuffer] = useState({});
    const [commandHistory, setCommandHistory] = useState({});
    const [historyIndex, setHistoryIndex] = useState({});

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
                    { type: 'output', text: 'Welcome to the Rust terminal!', className: 'terminal-welcome' },
                    { type: 'output', text: terminal.files.join('  '), className: '' }
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
        if (!wsRef.current) {
            wsRef.current = new WebSocket('ws://localhost:8080');

            wsRef.current.onopen = () => {
                console.log('Connected to WebSocket server');
                addOutputToTerminal(activeTerminal, 'Connected to server', 'terminal-info');
            };

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.output) {
                    addOutputToTerminal(activeTerminal, data.output.trim(), 'terminal-success');
                } else if (data.error) {
                    addOutputToTerminal(activeTerminal, data.error.trim(), 'terminal-error');
                } else if (data.status) {
                    if (data.status.includes('Process exited') || data.status.includes('Rust process stopped')) {
                        setProcessRunning(prev => ({ ...prev, [activeTerminal]: false }));
                    }
                    addOutputToTerminal(activeTerminal, data.status, 'terminal-info');
                }
            };

            wsRef.current.onclose = () => {
                console.log('Disconnected from WebSocket server');
                addOutputToTerminal(activeTerminal, 'Disconnected from server', 'terminal-error');
                setProcessRunning(prev => {
                    const newState = { ...prev };
                    Object.keys(newState).forEach(key => {
                        newState[key] = false;
                    });
                    return newState;
                });
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                addOutputToTerminal(activeTerminal, 'WebSocket error', 'terminal-error');
            };
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
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
            // List files
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
            // Clear terminal
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

                addOutputToTerminal(terminalId, "Running on server...", COLORS.INFO);
                setProcessRunning(prev => ({ ...prev, [terminalId]: true }));
            } else {
                addOutputToTerminal(terminalId, "WebSocket connection not established.", COLORS.ERROR);
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
        <Container>
            <TerminalHeader>
                <TerminalIconSection>
                    <TerminalIconWrapper>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </TerminalIconWrapper>
                    <DividerLine />
                    <AddButtonWrapper onClick={addNewTerminal} title="New Terminal">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </AddButtonWrapper>
                </TerminalIconSection>

                <TabsContainer>
                    {terminals.map(terminal => (
                        <Tab
                            key={terminal.id}
                            active={terminal.id === activeTerminal}
                            onClick={() => switchTerminal(terminal.id)}
                        >
                            <TabInner active={terminal.id === activeTerminal}>
                                <TerminalTabIcon>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </TerminalTabIcon>
                                <TabText>{terminal.name}</TabText>
                                {terminals.length > 1 && (
                                    <CloseButton
                                        onClick={(e) => closeTerminal(terminal.id, e)}
                                        title="Close Terminal"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </CloseButton>
                                )}
                            </TabInner>
                        </Tab>
                    ))}
                </TabsContainer>
            </TerminalHeader>

            <TerminalsContainer>
                {terminals.map(terminal => {
                    const terminalId = terminal.id;
                    const terminalHistory = history[terminalId] || [];
                    const buffer = inputBuffer[terminalId] || '';
                    const cursorPos = cursorPosition[terminalId] || 0;
                    const isProcessRunning = processRunning[terminalId];

                    return (
                        <TerminalWrapper
                            key={terminalId}
                            active={terminalId === activeTerminal}
                        >
                            <TerminalContent
                                ref={el => terminalRefs.current[terminalId] = el}
                                tabIndex={0}
                                onKeyDown={e => handleKeyDown(terminalId, e)}
                            >
                                {terminalHistory.map((item, index) => (
                                    <div key={index}>
                                        {item.type === 'command' ? (
                                            <CommandLine>
                                                <Prompt>{item.prompt || '$'}</Prompt>
                                                <CommandText className={COLORS.COMMAND}>{item.text}</CommandText>
                                            </CommandLine>
                                        ) : (
                                            <OutputLine className={item.className}>
                                                {item.text}
                                            </OutputLine>
                                        )}
                                    </div>
                                ))}


                                {!isProcessRunning && (
                                    <CommandLine>
                                        <Prompt>$</Prompt>
                                        <InputLine>
                                            <span className={COLORS.COMMAND}>
                                                {buffer.substring(0, cursorPos)}
                                            </span>

                                            <Cursor
                                                active={terminalId === activeTerminal}
                                                className={COLORS.COMMAND}
                                            >
                                                {cursorPos < buffer.length ? buffer.charAt(cursorPos) : ' '}
                                            </Cursor>

                                            <span className={COLORS.COMMAND}>
                                                {buffer.substring(cursorPos + 1)}
                                            </span>
                                        </InputLine>
                                    </CommandLine>
                                )}
                            </TerminalContent>
                        </TerminalWrapper>
                    );
                })}
            </TerminalsContainer>
        </Container>
    );
};

export default RealTerminalComponent;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;

    background-color: #000000;
    box-sizing: border-box;
    font-family: 'Inter', 'Roboto', sans-serif;
`;

const TerminalHeader = styled.div`
    display: flex;
    align-items: center;
    background-color: #1e1e1e;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 5;
`;

const TerminalIconSection = styled.div`
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 48px;
    border-right: 1px solid #333;
`;

const DividerLine = styled.div`
    width: 1px;
    height: 16px;
    background-color: #333;
    margin-left: 8px;
    margin-right: 8px;
    align-self: center;
`;

const TerminalIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00aaff;
    width: 32px;
    height: 32px;
`;

const AddButtonWrapper = styled.button`
    background: transparent;
    border: none;
    color: #aaa;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-left: 8px;

    &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const TabsContainer = styled.div`
    display: flex;
    height: 48px;
    flex-wrap: nowrap;
    overflow-x: auto;
    flex: 1;
    &::-webkit-scrollbar {
        height: 0;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Tab = styled.div`
    height: 100%;
    min-width: 130px;
    max-width: 200px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${props => props.active ? 'transparent' : '#2a2a2a'};
    }
`;

const TabInner = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    border-right: 1px solid #333;
    background-color: ${props => props.active ? '#252526' : 'transparent'};
    position: relative;

    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: ${props => props.active ? '#00aaff' : 'transparent'};
    }
`;

const TerminalTabIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00aaff;
    margin-right: 8px;
`;

const TabText = styled.span`
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    font-size: 13px;
    font-weight: 500;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #6e6e6e;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 8px;
    width: 18px;
    height: 18px;
    border-radius: 3px;

    &:hover {
        color: #ff6b6b;
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const TerminalsContainer = styled.div`
    position: relative;
    flex: 1;
    overflow: hidden;
    padding: 10px;
`;

const TerminalWrapper = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: ${props => props.active ? 'block' : 'none'};
`;

const TerminalContent = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    color: white;
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    background-color: #000;
    outline: none;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #111;
    }

    &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
    }

    .terminal-prompt {
        color: #c678dd;
        font-weight: bold;
    }

    .terminal-command {
        color: #e5c07b;
    }

    .terminal-rust-file {
        color: #ff8800;
    }

    .terminal-toml-file {
        color: #98c379;
    }

    .terminal-success {
        color: #4BB543;
    }

    .terminal-error {
        color: #ff6b6b;
    }

    .terminal-welcome {
        color: #61afef;
        font-weight: bold;
    }

    .terminal-info {
        color: #56b6c2;
    }

    .terminal-update {
        color: #d19a66;
    }
`;

const CommandLine = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 2px 0;
`;

const Prompt = styled.span`
    color: #c678dd;
    font-weight: bold;
    margin-right: 8px;
`;

const CommandText = styled.span`
    color: #e5c07b;
`;

const OutputLine = styled.div`
    margin: 2px 0;
    white-space: pre-wrap;
    word-break: break-word;
`;

const InputLine = styled.div`
    flex: 1;
    min-height: 1em;
    white-space: pre-wrap;
    word-break: break-word;
`;

const Cursor = styled.span`
    display: inline-block;
    background-color: ${props => props.active ? '#00aaff' : 'transparent'};
    color: #000;
    animation: ${props => props.active ? 'blink 1s step-end infinite' : 'none'};

    @keyframes blink {
        0%, 100% { background-color: #00aaff; color: #000; }
        50% { background-color: transparent; color: #e5c07b; }
    }
`;
