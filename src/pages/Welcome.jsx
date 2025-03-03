import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import Footer from '../components/Footer';

const Home = () => {
    const [text, setText] = useState('');
    const fullText = "Learn **It Faster!";

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

        return () => clearInterval(typingInterval);
    }, [fullText]);

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#FFFFFF' }}>
            <AppBar />
            <div
                style={{
                    minHeight: 'calc(100vh - 56px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: "'Poppins', Arial, sans-serif",
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontSize: '3.7rem',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                    }}
                >
                    {text}
                </h1>
            </div>
        </div>
    );
};

export default Home;
