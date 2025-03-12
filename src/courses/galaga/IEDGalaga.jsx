import React, { useState, useEffect } from "react";
import Instructions from "./components/Instruction";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Terminal";
import AppBarCourse from "./components/AppBarCourse";
import BottomBar from "./components/BottomBar";
import SyllabusPopup from "./components/SyllabusPopup";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const IEDGalaga = () => {
    const [userId, setUserId] = useState(null);
    const [instructionsWidth, setInstructionsWidth] = useState(33.33);
    const [outputWidth, setOutputWidth] = useState(33.33);
    const [isResizingInstruction, setIsResizingInstruction] = useState(false);
    const [isResizingOutput, setIsResizingOutput] = useState(false);
    const [task, setTask] = useState(null);
    const [allTasks, setAllTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [showTasksPopup, setShowTasksPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState({
        "main.rs": "// Write your Rust code here\n\nfn main() {\n    println!(\"Hello, Rust!\");\n}",
        "Cargo.toml": "[package]\nname = \"rust_project\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[dependencies]\n",
    });

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchTasks(user.uid);
            } else {
                console.error("User not authenticated");
                setIsLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (allTasks.length > 0 && currentTaskIndex >= 0 && currentTaskIndex < allTasks.length) {
            const currentTask = allTasks[currentTaskIndex];
            if (currentTask && (!task || task.task_id !== currentTask.task_id)) {
                fetchTaskById(currentTask.task_id);
            }
        }
    }, [currentTaskIndex, allTasks]);

    const fetchTasks = (uid) => {
        setIsLoading(true);
        // 🚨IP ADDRESS
        fetch(`http://146.190.127.237:4000/galaga/tasks?uuid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("All tasks:", data);
                setAllTasks(data);
                if (data.length > 0) {
                    findCurrentProgressPosition(data, uid);
                } else {
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching tasks:", err);
                setIsLoading(false);
            });
    };

    const findCurrentProgressPosition = (tasks, uid) => {
        fetch(`http://146.190.127.237:4000/galaga/next_task?uuid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Next Task:", data);
                if (data && data.task_id) {
                    setTask(data);
                    const index = tasks.findIndex((t) => t.task_id === data.task_id);
                    if (index !== -1) {
                        setCurrentTaskIndex(index);
                    }
                } else {
                    const lastCompletedIndex = findLastCompletedTaskIndex(tasks);
                    if (lastCompletedIndex !== -1) {
                        setCurrentTaskIndex(lastCompletedIndex);
                        fetchTaskById(tasks[lastCompletedIndex].task_id);
                    } else {
                        setCurrentTaskIndex(0);
                        fetchTaskById(tasks[0].task_id);
                    }
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching next task:", err);

                const firstIncompleteIndex = tasks.findIndex(task => !task.completed);
                if (firstIncompleteIndex !== -1) {
                    setCurrentTaskIndex(firstIncompleteIndex);
                    fetchTaskById(tasks[firstIncompleteIndex].task_id);
                } else {
                    setCurrentTaskIndex(tasks.length - 1);
                    fetchTaskById(tasks[tasks.length - 1].task_id);
                }
                setIsLoading(false);
            });
    };

    // Add the missing function definition here:
    const findLastCompletedTaskIndex = (tasks) => {
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].completed) {
                return i;
            }
        }
        return -1;
    };

    const fetchNextTask = (uid) => {
        fetch(`http://146.190.127.237:4000/galaga/next_task?uuid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Next Task:", data);
                if (data.task_id) {
                    setTask(data);
                    const index = allTasks.findIndex((t) => t.task_id === data.task_id);
                    if (index !== -1) {
                        setCurrentTaskIndex(index);
                    }
                }
            })
            .catch((err) => console.error("Error fetching next task:", err));
    };

    const fetchTaskById = (taskId) => {
        if (!userId) return;

        fetch(`http://146.190.127.237:4000/galaga/tasks/${taskId}?uuid=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Task:", data);
                if (data.task_id) {
                    setTask(data);
                }
            })
            .catch((err) => console.error(`Error fetching task ${taskId}:`, err));
    };

    const markTaskComplete = (taskId) => {
        fetch(`http://146.190.127.237:4000/galaga/tasks/${taskId}/complete?uuid=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uuid: userId }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Task marked as complete:", data);
                setAllTasks((prev) =>
                    prev.map((task) =>
                        task.task_id === taskId ? { ...task, completed: true } : task
                    )
                );
                setTask((prevTask) => ({
                    ...prevTask,
                    completed: true,
                }));

                if (currentTaskIndex < allTasks.length - 1) {
                    setTimeout(() => {
                        handleNextTask();
                    }, 500);
                }
            })
            .catch((err) => console.error("Error marking task complete:", err));
    };

    const handleMouseMove = (e) => {
        if (isResizingInstruction) {
            const newWidth = Math.min(50, Math.max(20, (e.clientX / window.innerWidth) * 100));
            setInstructionsWidth(newWidth);
        }
        if (isResizingOutput) {
            const newOutputWidth = Math.min(50, Math.max(20, ((window.innerWidth - e.clientX) / window.innerWidth) * 100));
            setOutputWidth(newOutputWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizingInstruction(false);
        setIsResizingOutput(false);
    };

    useEffect(() => {
        if (isResizingInstruction || isResizingOutput) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizingInstruction, isResizingOutput]);

    const handleFilesChange = (updatedFiles) => {
        console.log("Updated files state:", updatedFiles);
        setFiles(updatedFiles);
    };

    const handleNextTask = () => {
        if (currentTaskIndex < allTasks.length - 1 &&
            (task?.completed || allTasks[currentTaskIndex]?.completed)) {
            const nextTaskId = allTasks[currentTaskIndex + 1].task_id;
            setCurrentTaskIndex(currentTaskIndex + 1);
            fetchTaskById(nextTaskId);
        }
    };

    const handlePreviousTask = () => {
        if (currentTaskIndex > 0) {
            const prevTaskId = allTasks[currentTaskIndex - 1].task_id;
            setCurrentTaskIndex(currentTaskIndex - 1);
            fetchTaskById(prevTaskId);
        }
    };

    const isCurrentTaskCompleted = () => {
        if (task && task.completed) return true;
        if (allTasks[currentTaskIndex] && allTasks[currentTaskIndex].completed) return true;
        return false;
    };

    const handleSelectTask = (taskId, index) => {
        setCurrentTaskIndex(index);
        fetchTaskById(taskId);
        setShowTasksPopup(false);
    };

    const toggleTasksPopup = () => {
        setShowTasksPopup(!showTasksPopup);
    };

    const getCurrentTaskInfo = () => {
        const currentTask = task || (allTasks[currentTaskIndex] || {});
        return {
            title: currentTask.title || "",
            isCompleted: isCurrentTaskCompleted(),
            index: currentTaskIndex,
            total: allTasks.length
        };
    };

    const taskInfo = getCurrentTaskInfo();

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#1e1e1e", color: "white" }}>
                <div>Loading your progress...</div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
            <AppBarCourse
                style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
                onShowTasks={toggleTasksPopup}
            />

            <div style={{ display: "flex", width: "100%", height: "calc(100% - 64px - 60px)", marginTop: "80px", marginBottom: "64px", overflow: "hidden" }}>
                <div style={{ width: `${instructionsWidth}%`, minWidth: "20%", height: "100%", display: "flex", backgroundColor: "#1e1e1e", borderRight: "1px solid #333" }}>
                    <Instructions task={task} onTaskComplete={markTaskComplete} />
                </div>

                <div onMouseDown={() => setIsResizingInstruction(true)} style={{ width: "5px", cursor: "col-resize", backgroundColor: "#333", zIndex: 10 }}></div>

                <div style={{ flex: "1", position: "relative", backgroundColor: "#222", height: "100%", overflow: "hidden" }}>
                    <CodeEditor onFilesChange={handleFilesChange} files={files} />

                    <div onMouseDown={() => setIsResizingOutput(true)} style={{ position: "absolute", top: 0, right: 0, width: "5px", height: "100%", cursor: "col-resize", backgroundColor: "#333", zIndex: 20 }}></div>
                </div>

                <div style={{ width: `${outputWidth}%`, minWidth: "20%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e", borderLeft: "1px solid #333" }}>
                    <Output files={files} initialFiles={[Object.keys(files)]} />
                </div>
            </div>

            <BottomBar
                currentTaskIndex={taskInfo.index}
                totalTasks={taskInfo.total}
                taskTitle={taskInfo.title}
                onNext={handleNextTask}
                onBack={handlePreviousTask}
                isCurrentTaskCompleted={taskInfo.isCompleted}
                onShowTasks={toggleTasksPopup}
            />

            {showTasksPopup && (
                <SyllabusPopup
                    tasks={allTasks}
                    onClose={() => setShowTasksPopup(false)}
                    currentTaskIndex={currentTaskIndex}
                    onSelectTask={handleSelectTask}
                    allTasks={allTasks}
                />
            )}
        </div>
    );
};

export default IEDGalaga;
