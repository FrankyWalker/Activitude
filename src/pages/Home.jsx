import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const HomePage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const colors = {
        darkBlue: '#050a18',
        mediumBlue: '#0c1631',
        lightBlue: '#162754',
        orange: '#ff7700',
        green: '#00ff00',
        text: '#ffffff',
        subtext: '#b3c1d1'
    };

    const courses = [
        { id: 2, name: 'Learn Rust', completionPercentage: 0, type: 'Beginner', route: '/learnrust' },
        { id: 1, name: 'Galaga in Rust', completionPercentage: 100, type: 'Game Development', route: '/galagacourse' },
        { id: 3, name: 'Crossy Roads', completionPercentage: 45, type: 'Game Development', route: '/crossyroads' },
    ];

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

            <div style={{
                position: 'absolute',
                top: '80px',
                right: '80px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: `${colors.orange}22`,
                filter: 'blur(20px)',
                zIndex: 1
            }} />

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
                {courses.map((course) => (
                    <div
                        key={course.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: colors.text,
                            padding: '20px 25px',
                            width: '650px',
                            height: '80px',
                            position: 'relative',
                            backgroundColor: hoveredCard === course.id ? colors.lightBlue : colors.mediumBlue,
                            borderRadius: '12px',
                            boxShadow: hoveredCard === course.id
                                ? `0 0 15px ${
                                    course.type === 'Beginner'
                                        ? colors.green
                                        : colors.orange 
                                }, 0 0 0 2px ${
                                    course.type === 'Beginner'
                                        ? colors.green
                                        : colors.orange
                                }`
                                : '0 2px 10px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={() => setHoveredCard(course.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => navigate(course.route)}
                    >

                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            left: '-50px',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: hoveredCard === course.id
                                ? `${
                                    course.type === 'Beginner'
                                        ? colors.green
                                        : colors.orange
                                }40`
                                : 'transparent',
                            transition: 'all 0.3s ease',
                            filter: 'blur(20px)',
                            zIndex: 0
                        }} />

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
                                marginRight: '20px',
                                boxShadow: hoveredCard === course.id
                                    ? '0 0 10px rgba(255, 119, 0, 0.6)'
                                    : 'none',
                                zIndex: 2
                            }}
                        >
                            {course.completionPercentage > 0 ? 'Continue' : 'Start'}
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start', justifyContent: 'center', zIndex: 2 }}>
                            <span
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                    textShadow: hoveredCard === course.id
                                        ? (course.type === 'Beginner'
                                            ? `0 0 8px ${colors.green}`
                                            : `0 0 8px ${colors.orange}`)
                                        : 'none',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {course.name}
                            </span>

                            <span style={{
                                fontSize: '14px',
                                color: colors.subtext,
                                fontWeight: '400'
                            }}>
                                {course.type}
                            </span>
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
                ))}
            </div>
        </div>
    );
};

export default HomePage;