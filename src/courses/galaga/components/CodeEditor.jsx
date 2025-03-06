import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import FileCodeIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

const colors = {
    primary: "#f4a300",
    secondary: "#d76a00",
    background: "#1a1f29",
    panelBackground: "#2a323e",
    panelBorder: "#34404e",
    textPrimary: "#e0e0e0",
    textSecondary: "#b0b0b0",
    scrollbarThumb: "#3e4a59",
    hover: "#3a4a60",
    activeTabBorder: "#f4a300",
    activeTabBackground: "#2a323e",
};

const CodeEditor = ({ onFilesChange }) => {
    const defaultFiles = {
        "main.rs": "// Write your Rust code here\n\nfn main() {\n    println!(\"Hello, Rust!\");\n}",
        "Cargo.toml": "[package]\nname = \"rust_project\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[dependencies]\n"
    };

    const [activeFile, setActiveFile] = useState("main.rs");
    const [files, setFiles] = useState(defaultFiles);

    const handleCodeChange = (value) => {
        const updatedFiles = { ...files, [activeFile]: value };
        setFiles(updatedFiles);

        // Send updated files to parent
        if (onFilesChange) {
            onFilesChange(updatedFiles);
        }
    };

    const handleTabClick = (filename) => {
        setActiveFile(filename);
    };

    // Send initial files to parent when the component mounts
    useEffect(() => {
        if (onFilesChange) {
            onFilesChange(files);
        }
    }, []);

    return (
        <StyledEditorContainer>
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
                    extensions={activeFile === "main.rs" ? [rust()] : []}
                    theme={oneDark}
                    onChange={handleCodeChange}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "auto"
                    }}
                />
            </EditorContent>
        </StyledEditorContainer>
    );
};

export default CodeEditor;

// Fix: Renamed to StyledEditorContainer
const StyledEditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
        font-family: "JetBrains Mono", "Fira Code", monospace;
        font-size: 16px;
        width: 100%;
        height: 100%;
    }
`;