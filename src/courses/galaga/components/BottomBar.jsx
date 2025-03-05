import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledBottomBar = styled.footer`
    height: 60px;
    width: 100%;
    border-top: 1px solid white;
    background: #000; 
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
    position: fixed; 
    bottom: 0;
    left: 0;
`;

const TaskStatus = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #f1f1f1;
    text-align: center;
`;

const ButtonContainer = styled.div`
    position: absolute;
    right: 20px;
    display: flex;
`;

const NextButton = styled.button`
    padding: 10px 15px;
    background-color: ${(props) => (props.disabled ? "#3a3a3a" : "#00ff00")};
    border: 2px solid transparent;
    color: ${(props) => (props.disabled ? "#a6a6a6" : "#000")};
    font-size: 1rem;
    font-weight: bold;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border-radius: 8px;
    margin-right: 10px;

    &:hover {
        background-color: ${(props) =>
                props.disabled ? "#3a3a3a" : "#32cd32"};
    }
`;

const BackButton = styled.button`
    padding: 10px 15px;
    background-color: transparent;
    border: 2px solid #00ff00;
    color: #00ff00;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    margin-right: 18px;

    &:hover {
        background-color: rgba(0, 255, 0, 0.1);
    }
`;

const BottomBar = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    useEffect(() => {
        const mockTasks = ["Task 1", "Task 2", "Task 3"];
        setTasks(mockTasks);
        setCompletedTasks(1);
    }, []);

    useEffect(() => {
        setIsNextEnabled(completedTasks === tasks.length && tasks.length > 0);
    }, [completedTasks, tasks]);

    return (
        <StyledBottomBar>
            <TaskStatus>{`${completedTasks}/${tasks.length} tasks`}</TaskStatus>
            <ButtonContainer>
                <BackButton>Back</BackButton>
                <NextButton disabled={!isNextEnabled}>Next</NextButton>
            </ButtonContainer>
        </StyledBottomBar>
    );
};

export default BottomBar;
