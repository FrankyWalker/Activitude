import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";

const SyllabusPopup = ({ tasks = [], onClose, currentTaskIndex, onSelectTask, allTasks }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        calculateProgress(tasks);
    }, [tasks]);

    const calculateProgress = (taskList) => {
        if (taskList && taskList.length > 0) {
            const completedTasks = taskList.filter((task) => task.completed).length;
            setProgress(Math.round((completedTasks / taskList.length) * 100));
        } else {
            setProgress(0);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === "popup-overlay") {
            onClose();
        }
    };

    const isTaskSelectable = (task, index) => {
        // Allow selecting the current task, completed tasks, or the next available task
        return task.completed || index === currentTaskIndex ||
            (index > 0 && allTasks[index-1]?.completed);
    };

    const handleTaskSelect = (taskId, index) => {
        if (isTaskSelectable(allTasks[index], index)) {
            onSelectTask(taskId, index);
        }
    };

    // Navigation functions
    const handleNext = () => {
        if (currentTaskIndex < tasks.length - 1 &&
            (allTasks[currentTaskIndex].completed ||
                (currentTaskIndex > 0 && allTasks[currentTaskIndex-1]?.completed))) {
            const nextTaskId = allTasks[currentTaskIndex + 1].task_id;
            onSelectTask(nextTaskId, currentTaskIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentTaskIndex > 0) {
            const prevTaskId = allTasks[currentTaskIndex - 1].task_id;
            onSelectTask(prevTaskId, currentTaskIndex - 1);
        }
    };

    return (
        <div id="popup-overlay" style={overlayStyles} onClick={handleOverlayClick}>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                style={popupStyles}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={headerStyles}>
                    <div style={progressWrapperStyles}>
                        <svg viewBox="0 0 36 36" style={progressCircleStyles}>
                            <path
                                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#444"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeDasharray={`${progress}, 100`}
                            />
                        </svg>
                        <div style={progressTextStyles}>{progress}%</div>
                    </div>
                    <h2 style={titleStyles}>Tasks</h2>
                    <button style={closeButtonStyles} onClick={onClose}>
                        <X size={32} strokeWidth={3} />
                    </button>
                </div>

                <div style={navigationBarStyles}>
                    <button
                        style={{...navButtonStyles, opacity: currentTaskIndex > 0 ? 1 : 0.4}}
                        onClick={handlePrevious}
                        disabled={currentTaskIndex <= 0}
                    >
                        <ChevronLeft size={24} />
                        Previous
                    </button>
                    <div style={navInfoStyles}>
                        Task {currentTaskIndex + 1} of {tasks.length}
                    </div>
                    <button
                        style={{
                            ...navButtonStyles,
                            opacity: (currentTaskIndex < tasks.length - 1 &&
                                (allTasks[currentTaskIndex]?.completed ||
                                    (currentTaskIndex > 0 && allTasks[currentTaskIndex-1]?.completed))) ? 1 : 0.4
                        }}
                        onClick={handleNext}
                        disabled={!(currentTaskIndex < tasks.length - 1 &&
                            (allTasks[currentTaskIndex]?.completed ||
                                (currentTaskIndex > 0 && allTasks[currentTaskIndex-1]?.completed)))}
                    >
                        Next
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div style={taskListStyles}>
                    {tasks.map((task, index) => (
                        <div
                            key={task.task_id}
                            onClick={() => handleTaskSelect(task.task_id, index)}
                            style={{
                                ...taskItemStyles,
                                ...(task.completed ? completedTaskStyles : {}),
                                ...(currentTaskIndex === index ? currentTaskStyles : {}),
                                ...(isTaskSelectable(task, index) ? selectableTaskStyles : nonSelectableTaskStyles)
                            }}
                        >
                            <div
                                style={{
                                    ...checkmarkWrapperStyles,
                                    ...(task.completed ? completedCheckmarkStyles : {})
                                }}
                            >
                                {task.completed ? (
                                    <div style={completedCheckmarkIconStyles}>
                                        <Check size={24} strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div style={incompleteCheckmarkStyles} />
                                )}
                            </div>

                            <div style={taskContentStyles}>
                                <h3 style={{
                                    ...taskTitleStyles,
                                    ...(isTaskSelectable(task, index) ? {} : disabledTextStyles)
                                }}>
                                    {task.task_name || task.title}
                                </h3>
                                {(task.description || task.content) && (
                                    <p style={{
                                        ...taskDescriptionStyles,
                                        ...(isTaskSelectable(task, index) ? {} : disabledTextStyles)
                                    }}>
                                        {task.description || task.content}
                                    </p>
                                )}
                            </div>

                            {isTaskSelectable(task, index) && (
                                <button
                                    style={actionButtonStyles}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskSelect(task.task_id, index);
                                        onClose();
                                    }}
                                >
                                    Go To <ArrowRight size={20} style={buttonIconStyles} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "flex-start",
    zIndex: 1000,
};

const popupStyles = {
    width: "500px",
    backgroundColor: "#050a18",
    height: "100%",
    overflowY: "auto",
    color: "white",
};

const headerStyles = {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #333",
    color: "white",
};

const navigationBarStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid #222",
};

const navButtonStyles = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const navInfoStyles = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#aaa",
};

const progressWrapperStyles = {
    position: "relative",
    width: "50px",
    height: "50px",
    marginRight: "15px",
};

const progressCircleStyles = {
    transform: "rotate(-90deg)",
    width: "100%",
    height: "100%",
};

const progressTextStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
};

const titleStyles = {
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    color: "white",
    textTransform: "uppercase",
};

const closeButtonStyles = {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "white",
    padding: "10px",
    transition: "opacity 0.3s ease",
    fontWeight: "bold",
};

const taskListStyles = {
    padding: "20px",
};

const taskItemStyles = {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #222",
    transition: "all 0.3s ease",
    cursor: "pointer",
};

const completedTaskStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
};

const currentTaskStyles = {
    borderLeft: "3px solid #4a8cff",
    backgroundColor: "rgba(74, 140, 255, 0.1)",
};

const selectableTaskStyles = {
    cursor: "pointer",
    opacity: 1,
};

const nonSelectableTaskStyles = {
    cursor: "not-allowed",
    opacity: 0.5,
};

const disabledTextStyles = {
    color: "#666",
};

const checkmarkWrapperStyles = {
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
};

const incompleteCheckmarkStyles = {
    width: "24px",
    height: "24px",
    border: "2px solid white",
    borderRadius: "4px",
    transition: "all 0.3s ease",
};

const completedCheckmarkStyles = {
    opacity: 0.7,
};

const completedCheckmarkIconStyles = {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const taskContentStyles = {
    flex: 1,
    marginRight: "20px",
};

const taskTitleStyles = {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "white",
    letterSpacing: "-0.5px",
};

const taskDescriptionStyles = {
    fontSize: "16px",
    color: "#999",
    marginTop: "5px",
    fontWeight: "300",
};

const actionButtonStyles = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "10px 15px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
};

const buttonIconStyles = {
    marginLeft: "8px",
};

export default SyllabusPopup;
