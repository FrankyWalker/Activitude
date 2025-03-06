import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const CustomTerminalComponent = ({ files = {}, initialFiles = [["main.rs", "Cargo.toml"]] }) => {
    const [terminals, setTerminals] = useState([{ id: 1, name: "Term", files: initialFiles[0] }]);
    const [activeTerminal, setActiveTerminal] = useState(1);
    const terminalHistoryRef = useRef({});
    const terminalInputRefs = useRef({});
    const terminalContentRefs = useRef({});
    const fileContentRef = useRef({...files});
    const prevFilesRef = useRef({});

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

    useEffect(() => {
        terminals.forEach(terminal => {
            if (!terminalHistoryRef.current[terminal.id]) {
                terminalHistoryRef.current[terminal.id] = {
                    commands: [],
                    output: [],
                    commandIndex: -1,
                    currentCommand: ''
                };
            }
        });
    }, [terminals]);

    const addNewTerminal = () => {
        const newId = terminals.length > 0 ? Math.max(...terminals.map(t => t.id)) + 1 : 1;
        const fileSet = initialFiles[Math.min(terminals.length, initialFiles.length - 1)] || initialFiles[0];
        setTerminals([...terminals, { id: newId, name: `Term ${newId}`, files: fileSet }]);
        setActiveTerminal(newId);
    };

    const closeTerminal = (id, e) => {
        e.stopPropagation();
        if (terminals.length === 1) return;

        const newTerminals = terminals.filter(t => t.id !== id);
        setTerminals(newTerminals);

        if (activeTerminal === id) {
            setActiveTerminal(newTerminals[0].id);
        }

        delete terminalHistoryRef.current[id];
    };

    const switchTerminal = (id) => {
        setActiveTerminal(id);
        setTimeout(() => {
            if (terminalInputRefs.current[id]) {
                terminalInputRefs.current[id].focus();
            }
        }, 50);
    };

    const colorizeFiles = (filename) => {
        if (filename.endsWith('.rs')) {
            return COLORS.RUST_FILE;
        } else if (filename.endsWith('.toml')) {
            return COLORS.TOML_FILE;
        }
        return '';
    };

    const processCommand = (terminalId, command) => {
        const terminalObj = terminals.find(t => t.id === terminalId);
        const terminalFiles = terminalObj ? terminalObj.files : [];
        let output = [];

        if (command === 'ls') {
            terminalFiles.forEach(file => {
                output.push({
                    text: file,
                    className: colorizeFiles(file)
                });
            });
        } else if (command === 'clear') {
            const history = terminalHistoryRef.current[terminalId];
            if (history) {
                history.output = [];
            }
            return [];
        } else if (command === 'cargo run') {
            output.push(
                { text: "Running `target/debug/your_project`", className: COLORS.SUCCESS },
                { text: "Hello, World!", className: COLORS.SUCCESS }
            );
        } else if (command.startsWith('cat ')) {
            const filename = command.substring(4).trim();
            if (terminalFiles.includes(filename)) {
                if (files[filename]) {
                    output.push({ text: `${filename}:`, className: COLORS.RUST_FILE });

                    files[filename].split('\n').forEach(line => {
                        output.push({ text: line });
                    });
                } else {
                    output.push({ text: `No content available for file: ${filename}`, className: COLORS.ERROR });
                }
            } else {
                output.push({ text: `No such file or directory: ${filename}`, className: COLORS.ERROR });
            }
        } else if (command === 'help') {
            output.push(
                { text: "Available commands:", className: COLORS.INFO },
                { text: "  ls            - List files" },
                { text: "  cat <file>    - Show file contents" },
                { text: "  cargo run     - Run the Rust program" },
                { text: "  clear         - Clear the terminal" },
                { text: "  help          - Show this help" }
            );
        } else if (command.trim() === '') {
        } else {
            output.push({ text: `Command not found: ${command}`, className: COLORS.ERROR });
        }

        return output;
    };

    const handleCommandSubmit = (terminalId, command) => {
        const history = terminalHistoryRef.current[terminalId];

        history.commands.push(command);
        history.commandIndex = -1;

        const output = processCommand(terminalId, command);

        if (command === 'clear') {
            history.output = [];
        } else {
            history.output.push({
                type: 'command',
                text: command,
                prompt: '$'
            });

            output.forEach(line => {
                history.output.push({
                    type: 'output',
                    ...line
                });
            });
        }

        history.currentCommand = '';

        setTerminals([...terminals]);

        if (terminalContentRefs.current[terminalId]) {
            const element = terminalContentRefs.current[terminalId];
            element.scrollTop = element.scrollHeight;
        }
    };

    const handleKeyDown = (terminalId, e) => {
        const history = terminalHistoryRef.current[terminalId];

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.commands.length > 0) {
                const newIndex = history.commandIndex === -1
                    ? history.commands.length - 1
                    : Math.max(0, history.commandIndex - 1);

                history.commandIndex = newIndex;
                history.currentCommand = history.commands[newIndex];

                setTerminals([...terminals]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (history.commandIndex !== -1) {
                const newIndex = history.commandIndex < history.commands.length - 1
                    ? history.commandIndex + 1
                    : -1;

                history.commandIndex = newIndex;
                history.currentCommand = newIndex === -1 ? '' : history.commands[newIndex];

                setTerminals([...terminals]);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const currentCommand = history.currentCommand;
            if (currentCommand.startsWith('cat ')) {
                const partialFilename = currentCommand.substring(4).trim();
                const terminalObj = terminals.find(t => t.id === terminalId);
                const terminalFiles = terminalObj ? terminalObj.files : [];

                const matches = terminalFiles.filter(file =>
                    file.startsWith(partialFilename) && file !== partialFilename
                );

                if (matches.length === 1) {
                    history.currentCommand = `cat ${matches[0]}`;
                    setTerminals([...terminals]);
                }
            }
        }
    };

    const handleInputChange = (terminalId, e) => {
        const history = terminalHistoryRef.current[terminalId];
        history.currentCommand = e.target.value;

        setTerminals([...terminals]);
    };

    useEffect(() => {
        const changedFiles = [];
        for (const filename in files) {
            if (prevFilesRef.current[filename] !== files[filename]) {
                changedFiles.push(filename);
            }
        }

        if (changedFiles.length > 0) {
            prevFilesRef.current = { ...files };
            fileContentRef.current = { ...files };

            const history = terminalHistoryRef.current[activeTerminal];
            if (history) {

                setTerminals([...terminals]);

                if (terminalContentRefs.current[activeTerminal]) {
                    const element = terminalContentRefs.current[activeTerminal];
                    element.scrollTop = element.scrollHeight;
                }
            }
        }
    }, [files, activeTerminal, terminals]);

    useEffect(() => {
        if (terminalInputRefs.current[activeTerminal]) {
            terminalInputRefs.current[activeTerminal].focus();
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
                    <AddButtonWrapper onClick={addNewTerminal}>
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
                                    <CloseButton onClick={(e) => closeTerminal(terminal.id, e)}>
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
                    const history = terminalHistoryRef.current[terminal.id] || { output: [], currentCommand: '' };

                    return (
                        <TerminalWrapper
                            key={terminal.id}
                            active={terminal.id === activeTerminal}
                        >
                            <TerminalContent
                                ref={el => terminalContentRefs.current[terminal.id] = el}
                                onClick={() => {
                                    if (terminal.id === activeTerminal && terminalInputRefs.current[terminal.id]) {
                                        terminalInputRefs.current[terminal.id].focus();
                                    }
                                }}
                            >
                                <WelcomeMessage className={COLORS.WELCOME}>
                                    Welcome to the Rust terminal!
                                </WelcomeMessage>

                                <div>
                                    {terminal.files.map((file, index) => (
                                        <div key={index} className={colorizeFiles(file)}>
                                            {file}
                                        </div>
                                    ))}
                                </div>

                                {history.output.map((item, index) => (
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

                                <CommandLine>
                                    <Prompt>$</Prompt>
                                    <InputWrapper>
                                        <HiddenInput
                                            ref={el => terminalInputRefs.current[terminal.id] = el}
                                            type="text"
                                            value={history.currentCommand}
                                            onChange={(e) => handleInputChange(terminal.id, e)}
                                            onKeyDown={(e) => handleKeyDown(terminal.id, e)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCommandSubmit(terminal.id, history.currentCommand);
                                                }
                                            }}
                                        />
                                        <InputDisplay className={COLORS.COMMAND}>
                                            {history.currentCommand}
                                        </InputDisplay>
                                        <Cursor active={terminal.id === activeTerminal} />
                                    </InputWrapper>
                                </CommandLine>
                            </TerminalContent>
                        </TerminalWrapper>
                    );
                })}
            </TerminalsContainer>
        </Container>
    );
};

export default CustomTerminalComponent;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    border: 1px solid #FF4500;
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
    align-items: center;
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

const WelcomeMessage = styled.div`
    margin-bottom: 10px;
    font-weight: bold;
`;

const InputWrapper = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
`;

const HiddenInput = styled.input`
    position: absolute;
    opacity: 0;
    height: 0;
    width: 100%;
    z-index: 1;
    cursor: text;
`;

const InputDisplay = styled.span`
    color: #e5c07b;
`;

const Cursor = styled.span`
    display: inline-block;
    width: 8px;
    height: 16px;
    background-color: #00aaff;
    animation: ${props => props.active ? 'blink 1s step-end infinite' : 'none'};
    margin-left: 1px;
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
