import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const HomePage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [courses, setCourses] = useState([]);
    const [userUuid, setUserUuid] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {

                setUserUuid(user.uid);
            } else {

                setUserUuid(null);
                console.log("No user logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (userUuid) {
                try {

                    const response = await fetch(`http://localhost:8080/galaga/tasks?uuid=${userUuid}`);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const tasks = await response.json();

                    const completedTasks = tasks.filter(task => task.completed).length;
                    const totalTasks = tasks.length;
                    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    setCourses([
                        {
                            id: 1,
                            name: 'Galaga in Rust',
                            completionPercentage,
                            type: 'Game Development',
                            route: '/galagacourse'
                        }
                    ]);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                    setCourses([
                        {
                            id: 1,
                            name: 'Galaga in Rust',
                            completionPercentage: 0,
                            type: 'Game Development',
                            route: '/galagacourse'
                        }
                    ]);
                }
            } else {

                setCourses([
                    {
                        id: 1,
                        name: 'Galaga in Rust',
                        completionPercentage: 0,
                        type: 'Game Development',
                        route: '/galagacourse'
                    }
                ]);
            }
        };

        fetchTasks();
    }, [userUuid]);

    const colors = {
        darkBlue: '#050a18',
        mediumBlue: '#0c1631',
        lightBlue: '#162754',
        orange: '#ff7700',
        green: '#00ff00',
        text: '#ffffff',
        subtext: '#b3c1d1'
    };

    return (
        <div style={{
            backgroundColor: colors.darkBlue,
            height: '100vh',
            margin: 0,
            position: 'relative',
            fontFamily: '"Orbitron", "Roboto", sans-serif'
        }}>
            <AppBar />

            <div
                style={{
                    position: 'absolute',
                    left: '200px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: colors.orange,
                    boxShadow: '0 0 8px rgba(255, 119, 0, 0.6)'
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    top: '160px',
                    left: '240px',
                    color: colors.text,
                    fontSize: '28px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    zIndex: 10,
                    textShadow: '0 0 10px rgba(255, 119, 0, 0.4)'
                }}
            >
                MY COURSES
                <div style={{
                    height: '4px',
                    backgroundColor: colors.orange,
                    marginTop: '8px',
                    width: '120px',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px rgba(255, 119, 0, 0.6)'
                }} />
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '240px',
                    left: '240px',
                    right: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                gap: '20px',
                                color: colors.text,
                                padding: '20px 25px',
                                width: '650px',
                                height: '100px',
                                backgroundColor: hoveredCard === course.id ? colors.lightBlue : colors.mediumBlue,
                                borderRadius: '12px',
                                boxShadow: hoveredCard === course.id
                                    ? `0 0 15px ${colors.orange}, 0 0 0 2px ${colors.orange}`
                                    : '0 2px 10px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={() => setHoveredCard(course.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => navigate(course.route)}
                        >

                            <button
                                style={{
                                    backgroundColor: colors.orange,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '10px 18px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: hoveredCard === course.id
                                        ? '0 0 10px rgba(255, 119, 0, 0.6)'
                                        : 'none',
                                    zIndex: 2
                                }}
                            >
                                {course.completionPercentage > 0 ? 'Continue' : 'Start'}
                            </button>


                            <div style={{
                                flex: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>

                                <div
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '5px'
                                    }}
                                >
                                    {course.name}
                                </div>

                                <div
                                    style={{
                                        fontSize: '14px',
                                        color: colors.subtext
                                    }}
                                >
                                    {course.type}
                                </div>
                            </div>

                            <div style={{ width: 60, height: 60, zIndex: 2 }}>
                                <CircularProgressbar
                                    value={course.completionPercentage}
                                    text={`${course.completionPercentage}%`}
                                    styles={buildStyles({
                                        textSize: '24px',
                                        textColor: colors.text,
                                        pathColor: colors.orange,
                                        trailColor: '#2d345580',
                                        strokeLinecap: 'round'
                                    })}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ color: colors.text, fontSize: '16px' }}>Loading courses...</div>
                )}
            </div>
        </div>
    );
};

export default HomePage;