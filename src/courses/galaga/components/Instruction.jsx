import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Instructions = ({ tasks }) => {
    const [progress, setProgress] = useState(0);
    const [firstUncompletedTask, setFirstUncompletedTask] = useState(null);

    useEffect(() => {
        if (Array.isArray(tasks) && tasks.length > 0) {
            calculateProgress(tasks);

            const uncompleted = tasks.find((task) => !task.completed);
            setFirstUncompletedTask(uncompleted || null);
        }
    }, [tasks]);

    const calculateProgress = (tasks) => {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            setProgress(0);
            return;
        }
        const completedCount = tasks.filter((task) => task.completed).length;
        const progressPercentage = (completedCount / tasks.length) * 100;
        setProgress(progressPercentage);
    };

    return (
        <div style={styles.container}>

            <div style={styles.content}>
                <div style={styles.documentHeader}>
                    <div style={styles.headerDecoration} />
                    <h2 style={styles.subtitle}>Instructions</h2>
                    <div style={styles.headerDecoration} />
                </div>

                {firstUncompletedTask && (
                    <div style={styles.highlightedTask}>
                        <h3 style={styles.highlightedTitle}>Next Task:</h3>
                        <p style={styles.highlightedText}>
                            {firstUncompletedTask.task_name}
                        </p>
                    </div>
                )}

                <div style={styles.taskList}>
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <React.Fragment key={task.task_id}>
                                <div
                                    style={{
                                        ...styles.taskItem,
                                        opacity: task.completed ? 0.8 : 1,
                                    }}
                                >
                                    <div style={styles.taskContentWrapper}>
                                        <span style={styles.taskNumber}>
                                            {index + 1}.
                                        </span>
                                        <span style={styles.taskText}>
                                            {task.task_name}
                                        </span>
                                        {task.completed && (
                                            <span style={styles.checkmark}>
                                                ✔
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {index < tasks.length - 1 && (
                                    <div style={styles.taskSeparator} />
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <p style={styles.noTasksMessage}>
                            No tasks available. Add some tasks to get started!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

Instructions.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            task_id: PropTypes.string.isRequired,
            task_name: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ),
};

Instructions.defaultProps = {
    tasks: [],
};

export default Instructions;

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

    title: {
        margin: "10px 0",
        color: "#FFF",
        fontSize: "24px",
        fontWeight: "500",
        textAlign: "center",
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
        backgroundColor: "#555",
    },
    subtitle: {
        color: "#FFF",
        fontSize: "20px",
        margin: 0,
        whiteSpace: "nowrap",
    },
    highlightedTask: {
        backgroundColor: "#333",
        padding: "15px",
        borderRadius: "6px",
        marginBottom: "20px",
    },
    highlightedTitle: {
        color: "#FFF",
        fontSize: "18px",
        margin: 0,
    },
    highlightedText: {
        fontSize: "16px",
        color: "#FFF",
        margin: "5px 0 0 0",
    },
    taskList: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "15px",
    },
    taskItem: {
        backgroundColor: "#111",
        borderRadius: "6px",
        padding: "12px 15px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        width: "100%",
        boxSizing: "border-box",
    },
    taskContentWrapper: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    taskNumber: {
        color: "#FFF",
        minWidth: "20px",
    },
    taskText: {
        flex: 1,
        fontSize: "16px",
        color: "#FFF",
    },
    checkmark: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#00FF00",
        marginLeft: "10px",
    },
    taskSeparator: {
        height: "1px",
        backgroundColor: "#555",
        margin: "10px 0",
    },
    noTasksMessage: {
        textAlign: "center",
        color: "#777",
        marginTop: "20px",
    },
};
