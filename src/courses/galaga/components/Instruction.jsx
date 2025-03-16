import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Instructions = ({ task, onTaskComplete }) => {
    const [isCompleted, setIsCompleted] = useState(task?.completed || false);

    // Reset isCompleted when the task changes
    useEffect(() => {
        if (task) {
            setIsCompleted(task.completed || false);
        }
    }, [task]);

    const handleCompleteClick = () => {
        if (!isCompleted) {
            const newCompletedState = true;
            setIsCompleted(newCompletedState);
            if (onTaskComplete) {
                onTaskComplete(task?.task_id, newCompletedState);
            }
        }
    };

    if (!task) {
        return (
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.documentHeader}>
                        <div style={styles.headerDecoration} />
                        <h2 style={styles.subtitle}>Instructions</h2>
                        <div style={styles.headerDecoration} />
                    </div>
                    <p style={styles.noTaskMessage}>No task selected.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.documentHeader}>
                    <div style={styles.headerDecoration} />
                    <h2 style={styles.subtitle}>Instructions</h2>
                    <div style={styles.headerDecoration} />
                </div>

                <div style={styles.taskHeader}>
                    <h2 style={styles.taskTitle}>{task.task_name}</h2>
                    <div style={styles.completionContainer}>
                        <div
                            onClick={handleCompleteClick}
                            style={styles.checkboxContainer}
                        >
                            <div style={{
                                ...styles.checkbox,
                                backgroundColor: isCompleted ? "#00FF00" : "transparent"
                            }}>
                                {isCompleted && <span style={styles.checkmark}>✓</span>}
                            </div>
                        </div>
                        <div style={styles.completionText}>
                            {isCompleted ? "Task completed!" : "Click when task is complete"}
                        </div>
                    </div>
                </div>

                <div style={styles.taskDescription}>
                    <p>{task.description}</p>
                </div>

                {task.expected_output && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <span style={styles.sectionIcon}>✓</span> Expected Output
                        </h3>
                        <div style={styles.codeBlock}>
                            {task.expected_output.map((output, index) => (
                                <div key={index} style={styles.outputLine}>{output}</div>
                            ))}
                        </div>
                    </div>
                )}

                {task.starter_code && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <span style={styles.sectionIcon}>💻</span> Implementation Tips
                        </h3>
                        <ul style={styles.tipsList}>
                            <li>Remember to handle all edge cases mentioned in the description</li>
                            <li>Your solution will be tested against the expected output</li>
                            <li>Focus on writing clean, efficient code</li>
                        </ul>
                    </div>
                )}

                <div style={styles.helpSection}>
                    <div style={styles.helpIcon}>💡</div>
                    <div style={styles.helpContent}>
                        <h4 style={styles.helpTitle}>Need Help?</h4>
                        <p style={styles.helpText}>
                            If you're stuck, try breaking down the problem into smaller steps.
                            For this factorial implementation, consider how to handle special cases first.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Instructions.propTypes = {
    task: PropTypes.shape({
        task_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        task_name: PropTypes.string,
        description: PropTypes.string,
        completed: PropTypes.bool,
        expected_output: PropTypes.array,
        starter_code: PropTypes.object
    }),
    onTaskComplete: PropTypes.func
};

const styles = {
    container: {
        backgroundColor: "#050a18",
        color: "#FFF",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
    content: {
        padding: "20px",
        width: "100%",
        maxHeight: "100%",
        overflowY: "scroll", // Ensure scrollable behavior
        boxSizing: "border-box",
        scrollbarWidth: "none", // Hides scrollbar in Firefox
        msOverflowStyle: "none", // Hides scrollbar in IE/Edge
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
        backgroundColor: "#555",
    },
    subtitle: {
        color: "#FFF",
        fontSize: "20px",
        margin: 0,
        whiteSpace: "nowrap",
    },
    taskHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    taskTitle: {
        fontSize: "24px",
        color: "#FFF",
        margin: 0,
    },
    completionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
    },
    checkboxContainer: {
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    checkbox: {
        width: "24px",
        height: "24px",
        border: "2px solid #00FF00",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.2s ease",
    },
    checkmark: {
        color: "#000",
        fontSize: "16px",
        fontWeight: "bold",
    },
    completionText: {
        fontSize: "14px",
        color: "#AAA",
        textAlign: "center",
    },
    taskDescription: {
        backgroundColor: "#111",
        padding: "20px",
        borderRadius: "6px",
        marginBottom: "25px",
        borderLeft: "4px solid #00bfff",
    },
    noTaskMessage: {
        textAlign: "center",
        color: "#777",
        marginTop: "20px",
    },
    section: {
        marginBottom: "25px",
    },
    sectionTitle: {
        fontSize: "18px",
        color: "#00bfff",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
    },
    sectionIcon: {
        marginRight: "10px",
        fontSize: "18px",
    },
    codeBlock: {
        backgroundColor: "#1a1e2e",
        padding: "15px",
        borderRadius: "6px",
        fontFamily: "monospace",
        overflowX: "auto",
        border: "1px solid #2a2e3e",
    },
    outputLine: {
        padding: "5px 0",
        color: "#00ff00",
    },
    tipsList: {
        backgroundColor: "#1a1e2e",
        padding: "15px 15px 15px 35px",
        borderRadius: "6px",
        border: "1px solid #2a2e3e",
    },
    helpSection: {
        display: "flex",
        backgroundColor: "#1e3a55",
        borderRadius: "6px",
        padding: "20px",
        marginTop: "30px",
        border: "1px solid #2a5980",
    },
    helpIcon: {
        fontSize: "24px",
        marginRight: "15px",
    },
    helpContent: {
        flex: 1,
    },
    helpTitle: {
        margin: "0 0 10px 0",
        color: "#7cc5ff",
        fontSize: "18px",
    },
    helpText: {
        margin: 0,
        lineHeight: "1.5",
    }
};

export default Instructions;