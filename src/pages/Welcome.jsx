import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            backgroundColor: '#050a18',
            minHeight: '100vh',
            color: '#FFFFFF',
            fontFamily: "'Roboto Mono', monospace",
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 119, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(255, 119, 0, 0.03) 0%, transparent 40%)',
            backgroundSize: 'cover',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 119, 0, 0.1)',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '-50px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 119, 0, 0.1)',
                zIndex: 0
            }}></div>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                    linear-gradient(to right, rgba(255, 119, 0, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 119, 0, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                zIndex: 0
            }}></div>

            <AppBar />
            <div
                style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 20px',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div style={{
                    position: 'relative',
                    marginBottom: '3rem'
                }}>
                    <h1
                        style={{
                            fontSize: '4.5rem',
                            letterSpacing: '0.2em',
                            fontWeight: '700',
                            margin: 0,
                            position: 'relative',
                            color: 'white',
                            textShadow: '0 0 10px rgba(255, 119, 0, 0.3)'
                        }}
                    >
                        {text}<span style={{ opacity: showCursor ? 1 : 0, color: '#ff7700' }}>_</span>
                    </h1>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '-10px',
                        right: '-10px',
                        bottom: '-10px',
                        border: '2px solid #ff7700',
                        opacity: 0.4,
                        zIndex: -1
                    }}></div>
                </div>

                <h2
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        opacity: '0.8',
                        letterSpacing: '0.15em',
                        marginBottom: '4rem',
                        textAlign: 'center',
                        maxWidth: '600px',
                        padding: '0 20px',
                        lineHeight: '1.8'
                    }}
                >
                    LEARN <span style={{ color: '#ff7700', fontWeight: '600' }}>IT FASTER</span>. BECOME A <span style={{ color: '#ff7700', fontWeight: '600' }}>RUSTACEAN</span> 🦀.
                </h2>

                <button
                    style={{
                        backgroundColor: 'transparent',
                        border: '2px solid #ff7700',
                        color: '#ff7700',
                        padding: '15px 50px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        zIndex: 1
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff7700';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 119, 0, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#ff7700';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => navigate('/home')}
                >
                    BEGIN
                </button>
            </div>

            <footer style={{
                borderTop: '1px solid rgba(255, 119, 0, 0.2)',
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                opacity: '0.8',
                position: 'relative',
                zIndex: 1
            }}>
                <div>© {new Date().getFullYear()} <span style={{ color: '#ff7700' }}>CypherBloom</span></div>
                <div style={{
                    display: 'flex',
                    gap: '30px'
                }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff7700'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>About</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff7700'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Contact</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff7700'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Privacy</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff7700'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;