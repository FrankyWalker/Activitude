import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AppBar from '../components/AppBar';

const Welcome = () => {
    const [text, setText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "ACTIVITUDE";
    const navigate = useNavigate();

    useEffect(() => {
        const characters = Array.from(fullText);
        let index = 0;

        const typingInterval = setInterval(() => {
            if (index < characters.length) {
                setText((prev) => characters.slice(0, index + 1).join(''));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 120);

        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, [fullText]);

    return (
        <div style={{
            backgroundColor: '#000000',
            minHeight: '100vh',
            color: '#FFFFFF',
            fontFamily: "'Roboto Mono', monospace",
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppBar />
            <div
                style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 20px'
                }}
            >
                <h1
                    style={{
                        fontSize: '3.5rem',
                        letterSpacing: '0.2em',
                        fontWeight: '300',
                        marginBottom: '2rem'
                    }}
                >
                    {text}<span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
                </h1>
                <h2
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        opacity: '0.7',
                        letterSpacing: '0.1em',
                        marginBottom: '3rem'
                    }}
                >
                    LEARN **IT FASTER. BECOME A RUSTECEAN 🦀.
                </h2>
                <button
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        padding: '12px 40px',
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = 'black';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                    }}
                    onClick={() => navigate('/home')}
                >
                    BEGIN
                </button>
            </div>

            <footer style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                opacity: '0.6',
            }}>
                <div>© {new Date().getFullYear()} CypherBloom</div>
                <div style={{
                    display: 'flex',
                    gap: '20px'
                }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;