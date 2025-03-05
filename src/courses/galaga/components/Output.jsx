import React, { useState } from "react";
import styled from "styled-components";

const Terminal = ({ output: providedOutput }) => {
    const [activeTab, setActiveTab] = useState("output");
    const [commandHistory, setCommandHistory] = useState([]);
    const [userInput, setUserInput] = useState("");

    const commandOutputs = {
        ls: "src\npackage.json\nnode_modules\nREADME.md",
        "cargo clippy": "Checking your-project v0.1.0 (/path/to/your/project)\nDone.",
        "cargo run": "Running `target/debug/your_project`\nHello, World!",
    };

    const handleCommand = (command) => {
        if (command.trim() === "") return;

        // Check if the command exists in simulated outputs
        const simulatedOutput =
            commandOutputs[command] || `Command not found: ${command}`;

        setCommandHistory((prev) => [
            ...prev,
            { command, output: simulatedOutput },
        ]);


        setUserInput("");
    };

    const parseOutput = (outputText) => {
        const lines = outputText.split("\n");

        return lines.map((line, index) => {
            if (line.startsWith("error:") || line.includes("error[")) {
                return <ErrorLine key={index}>{line}</ErrorLine>;
            } else if (line.startsWith("-->")) {
                return <FileLine key={index}>{line}</FileLine>;
            } else if (line.trim().startsWith("|")) {
                return <CodeLine key={index}>{line}</CodeLine>;
            } else if (line.trim().startsWith("note:") || line.trim().startsWith("help:")) {
                return <HelpLine key={index}>{line}</HelpLine>;
            } else {
                return <NormalLine key={index}>{line}</NormalLine>;
            }
        });
    };

    return (
        <Container>
            <TabBar>
                <Tab
                    active={activeTab === "terminal"}
                    onClick={() => setActiveTab("terminal")}
                >
                    TERMINAL
                </Tab>

                <Tab
                    active={activeTab === "output"}
                    onClick={() => setActiveTab("output")}
                >
                    OUTPUT
                </Tab>
            </TabBar>

            <Section>
                {activeTab === "terminal" && (
                    <BashContent>
                        <Prompt>$ </Prompt>
                        <InputField
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleCommand(userInput);
                                }
                            }}
                            placeholder="Enter command..."
                        />
                    </BashContent>
                )}

                {activeTab === "output" && (
                    <OutputArea>
                        {providedOutput
                            ? parseOutput(providedOutput)
                            : commandHistory.map((entry, index) => (
                                <div key={index}>
                                    <CommandLine>
                                        $ {entry.command}
                                    </CommandLine>
                                    {parseOutput(entry.output)}
                                </div>
                            ))}
                    </OutputArea>
                )}
            </Section>
        </Container>
    );
};

export default Terminal;

// Styled components
const Container = styled.div`
    display: flex;
    width: 100%;
    min-width: 100px;
    height: 100vh;
    border: 1px solid #1e2a38;
    position: relative;
    flex-direction: column;
    background-color: #000000;
`;

const TabBar = styled.div`
    display: flex;
    background-color: #1a1a1a;
    border-bottom: 1px solid #333;
`;

const Tab = styled.div`
    padding: 12px 24px;
    cursor: pointer;
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: ${(props) => (props.active ? "#ffffff" : "#aaa")}; /* Updated */
    background-color: ${(props) => (props.active ? "#1e1e1e" : "transparent")};
    border-bottom: ${(props) =>
            props.active ? "2px solid #ffffff" /* Updated */ : "none"};
    transition: all 0.2s ease;

    &:hover {
        color: ${(props) => (props.active ? "#ffffff" : "white")}; /* Updated */
        background-color: #222;
    }
`;

const Section = styled.div`
    flex: 1;
    background-color: #000000;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const OutputArea = styled.div`
    flex: 1;
    width: 100%;
    color: #e0e0e0;
    font-family: 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
    font-size: 0.95rem;
    white-space: pre-wrap;
    padding-right: 15px;
`;

const BashContent = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 0;
`;

const Prompt = styled.span`
    color: #ffffff; /* Updated */
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 1rem;
    font-weight: bold;
    margin-right: 8px;
`;

const InputField = styled.input`
    flex: 1;
    background-color: transparent;
    border: none;
    color: white;
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 0.95rem;
    outline: none;

    &::placeholder {
        color: #666;
    }
`;

const NormalLine = styled.div`
    color: #e0e0e0;
    line-height: 1.5;
`;

const ErrorLine = styled.div`
    color: #cf6679;
    font-weight: bold;
    line-height: 1.5;
`;

const FileLine = styled.div`
    color: #ffb74d;
    font-style: italic;
    line-height: 1.5;
`;

const CodeLine = styled.div`
    color: #82aaff;
    line-height: 1.5;
`;

const HelpLine = styled.div`
    color: #03dac6;
    font-style: italic;
    line-height: 1.5;
`;

const CommandLine = styled.div`
    color: #ffffff; /* Updated */
    font-weight: bold;
    line-height: 1.5;
`;
