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

    const courses = [
        { id: 1, name: 'Galaga in Rust', completionPercentage: 100, type: 'Game Development', route: '/galagacourse' },
        { id: 2, name: 'Crossy Roads', completionPercentage: 45, type: 'Game Development', route: '/crossyroads' },
    ];

    return (
        <div style={{ backgroundColor: 'black', height: '100vh', margin: 0, position: 'relative', fontFamily: '"Roboto", sans-serif' }}>
            <AppBar />

            <div
                style={{
                    position: 'absolute',
                    left: '200px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: 'white',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    top: '100px',
                    left: '240px',
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    zIndex: 10,
                }}
            >
                MY COURSES
                <div style={{ height: '4px', backgroundColor: '#6400e4', marginTop: '8px', width: '60px' }} />
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '180px',
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
                            color: 'white',
                            padding: '20px 25px',
                            width: '650px',
                            height: '80px',
                            position: 'relative',
                            backgroundColor: hoveredCard === course.id ? '#1f2a5c' : '#19203d',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease',
                            border: hoveredCard === course.id ? '1px solid #404b75' : '1px solid transparent',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHoveredCard(course.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => navigate(course.route)} // Redirect to course route
                    >
                        <button
                            style={{
                                backgroundColor: '#6400e4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginRight: '20px',
                            }}
                        >
                            Continue
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <span
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                }}
                            >
                                {course.name}
                            </span>

                            <span style={{ fontSize: '14px', color: '#a2a9cc', fontWeight: '400' }}>{course.type}</span>
                        </div>

                        <div style={{ width: 60, height: 60 }}>
                            <CircularProgressbar
                                value={course.completionPercentage}
                                text={`${course.completionPercentage}%`}
                                styles={buildStyles({
                                    textSize: '24px',
                                    textColor: 'white',
                                    pathColor: '#6400e4',
                                    trailColor: '#2d3455',
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