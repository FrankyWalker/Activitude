import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";

const SyiblesPopup = ({ tasks = [], onClose }) => {
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
                {/* Header Section */}
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

                {/* Main Task List */}
                <div style={taskListStyles}>
                    {tasks.map((task) => (
                        <div
                            key={task.task_id}
                            style={{
                                ...taskItemStyles,
                                ...(task.completed ? completedTaskStyles : {}),
                            }}
                        >
                            {/* Custom Checkmark */}
                            <div
                                style={{
                                    ...checkmarkWrapperStyles,
                                    ...(task.completed ? completedCheckmarkStyles : {}),
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

                            {/* Task Content */}
                            <div style={taskContentStyles}>
                                <h3 style={taskTitleStyles}>{task.task_name}</h3>
                                {task.description && (
                                    <p style={taskDescriptionStyles}>
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            {/* Action Button */}
                            <button
                                style={actionButtonStyles}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Navigate to task ${task.task_id}`);
                                }}
                            >
                                Go To <ArrowRight size={20} style={buttonIconStyles} />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// Styles
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
    width: "600px",
    backgroundColor: "black",
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
    transition: "background-color 0.3s ease",
};

const completedTaskStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle highlight
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

export default SyiblesPopup;