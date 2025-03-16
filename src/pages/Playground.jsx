import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Code, Terminal as TerminalIcon, PanelLeft, Rows } from 'lucide-react';
import Terminal from '../courses/galaga/components/Terminal';
import CodeEditor from '../courses/galaga/components/CodeEditor';

const APP_BAR_HEIGHT = 70;

const PlaygroundContainer = styled.div`
    background-color: #050a18;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
`;

const AppBar = styled.div`
    height: ${APP_BAR_HEIGHT}px;
    background-color: #050a18;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-bottom: 2px solid #ff4500;
`;

const Title = styled.div`
    color: #e0e0e0;
    font-size: 16px;
    font-weight: 600;
    margin-right: auto;
`;

const IconButton = styled.button`
    background: ${props => props.active ? '#3a3a3a' : 'transparent'};
    border: none;
    border-radius: 4px;
    color: #e0e0e0;
    padding: 8px;
    margin-left: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
        background-color: #3a3a3a;
    }
`;

const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: ${props => props.isHorizontal ? 'row' : 'column'};
    overflow: hidden;
    height: calc(100vh - ${APP_BAR_HEIGHT}px); 
`;

const EditorContainer = styled.div`
    ${props => props.isHorizontal
            ? `width: ${props.size}px; height: 100%;`
            : `width: 100%; height: ${props.size}px;`}
    background-color: #1e1e1e;
    border: 1px solid #333;
    overflow: hidden;
`;

const TerminalContainer = styled.div`
    flex: 1;
    background-color: #0A1929;
    border: 1px solid #333;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 6px; 
`;


const HorizontalSlider = styled.div`
    width: 6px;
    cursor: ew-resize;
    background-color: #4f4f4f;
    position: absolute;
    left: ${props => props.position}px;
    height: calc(100vh - ${APP_BAR_HEIGHT}px);
    z-index: 10;

    &:hover, &:active {
        background-color: #6f6f6f;
    }
`;

const VerticalSlider = styled.div`
    height: 6px;
    cursor: ns-resize;
    background-color: #4f4f4f;
    position: absolute;
    top: ${props => props.position + APP_BAR_HEIGHT}px;
    width: 100%;
    z-index: 10;

    &:hover, &:active {
        background-color: #6f6f6f;
    }
`;

const Playground = () => {
    const [isHorizontal, setIsHorizontal] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [size, setSize] = useState(isHorizontal ? window.innerWidth / 2 : (window.innerHeight - APP_BAR_HEIGHT) / 2);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        if (isHorizontal) {
            const newSize = Math.max(200, Math.min(e.clientX, window.innerWidth - 200));
            setSize(newSize);
        } else {
            const contentTop = APP_BAR_HEIGHT;
            const relativeY = e.clientY - contentTop;
            const newSize = Math.max(100, Math.min(relativeY, window.innerHeight - APP_BAR_HEIGHT - 100));
            setSize(newSize);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const toggleLayout = (horizontal) => {
        setIsHorizontal(horizontal);

        setSize(horizontal ? window.innerWidth / 2 : (window.innerHeight - APP_BAR_HEIGHT) / 2);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isHorizontal]);

    return (
        <PlaygroundContainer>
            <AppBar>
                <Title>Code Playground</Title>
                <IconButton
                    active={isHorizontal}
                    onClick={() => toggleLayout(true)}
                    title="Side by side layout"
                >
                    <PanelLeft size={20} />
                </IconButton>
                <IconButton
                    active={!isHorizontal}
                    onClick={() => toggleLayout(false)}
                    title="Stacked layout"
                >
                    <Rows size={20} />
                </IconButton>
            </AppBar>

            <ContentContainer isHorizontal={isHorizontal}>
                <EditorContainer isHorizontal={isHorizontal} size={size}>
                    <CodeEditor />
                </EditorContainer>

                {isHorizontal ? (
                    <HorizontalSlider position={size} onMouseDown={handleMouseDown} />
                ) : (
                    <VerticalSlider position={size} onMouseDown={handleMouseDown} />
                )}

                <TerminalContainer>
                    <Terminal />
                </TerminalContainer>
            </ContentContainer>
        </PlaygroundContainer>
    );
};

export default Playground;
