import React, { useEffect, useState } from "react";

const Instructions = () => {
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(null);

    const fakeTasks = [
        { id: 1, text: "Complete the React tutorial", isCompleted: false },
        { id: 2, text: "Write tests for components", isCompleted: false },
        { id: 3, text: "Fix UI bugs in dashboard", isCompleted: true },
    ];

    const fakeProgress = { progress: 50 };

    useEffect(() => {
        setTasks(fakeTasks);
        setProgress(fakeProgress);
    }, []);

    const toggleTaskCompletion = (taskId, isCompleted) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
            )
        );
        const completedTasks = tasks.filter((task) => task.isCompleted).length;
        const newProgress = Math.round(
            ((completedTasks + (isCompleted ? -1 : 1)) / tasks.length) * 100
        );
        setProgress({ progress: newProgress });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Galaga Course</h1>
                {progress && (
                    <div style={styles.progressContainer}>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${progress.progress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            <div style={styles.content}>
                <div style={styles.documentHeader}>
                    <div style={styles.headerDecoration} />
                    <h2 style={styles.subtitle}>Instructions</h2>
                    <div style={styles.headerDecoration} />
                </div>

                <div style={styles.taskList}>
                    {tasks.map((task, index) => (
                        <React.Fragment key={task.id}>
                            <div style={styles.taskItem}>
                                <button
                                    style={{
                                        ...styles.checkButton,
                                        backgroundColor: task.isCompleted ? "#B388FF" : "#673AB7",
                                    }}
                                    onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                >
                                    {task.isCompleted ? "✓" : ""}
                                </button>
                                <div style={styles.taskContentWrapper}>
                                    <span style={styles.taskNumber}>{index + 1}.</span>
                                    <span
                                        style={{
                                            ...styles.taskText,
                                            color: task.isCompleted ? "#AAA" : "#FFFFFF",
                                            backgroundColor: task.isCompleted ? "transparent" : "#2C2042",
                                        }}
                                    >
                                        {task.text}
                                    </span>
                                </div>
                            </div>
                            {index < tasks.length - 1 && <div style={styles.taskSeparator} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#121212",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
    header: {
        backgroundColor: "#1A1A1A",
        borderBottom: "2px solid #2C2042",
        width: "100%",
        padding: "10px 0",
        boxSizing: "border-box",
    },
    title: {
        margin: "10px 0",
        color: "#D0A9FF",
        fontSize: "24px",
        fontWeight: "500",
        textAlign: "center",
    },
    progressContainer: {
        padding: "10px 20px",
    },
    progressBar: {
        width: "100%",
        height: "8px",
        backgroundColor: "#2C2042",
        borderRadius: "4px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#B388FF",
        transition: "width 0.3s ease-in-out",
    },
    content: {
        padding: "20px",
        width: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
    },
    documentHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px",
    },
    headerDecoration: {
        flex: 1,
        height: "2px",
        backgroundColor: "#673AB7",
    },
    subtitle: {
        color: "#D0A9FF",
        fontSize: "20px",
        margin: 0,
        whiteSpace: "nowrap",
    },
    taskList: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "15px",
    },
    taskItem: {
        backgroundColor: "#1A1A1A",
        borderRadius: "6px",
        padding: "12px 15px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        width: "100%",
        boxSizing: "border-box",
    },
    taskContentWrapper: {
        flex: 1,
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
    },
    taskNumber: {
        color: "#D0A9FF",
        minWidth: "20px",
        paddingTop: "2px",
    },
    checkButton: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        flexShrink: 0,
    },
    taskText: {
        flex: 1,
        fontSize: "16px",
        padding: "5px 10px",
        borderRadius: "4px",
        lineHeight: "1.5",
    },
    taskSeparator: {
        height: "1px",
        backgroundColor: "#673AB7",
        margin: "10px 0",
    },
};

export default Instructions;