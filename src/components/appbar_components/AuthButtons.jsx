import React from 'react';

const AuthButtons = ({ navigate }) => {
    return (
        <>
            <button style={loginButton} onMouseOver={hoverEffect} onMouseOut={resetEffect} onClick={() => navigate('/login')}>
                Login
            </button>
            <button style={signUpButton} onMouseOver={hoverSignUp} onMouseOut={resetSignUp} onClick={() => navigate('/signup')}>
                Sign Up
            </button>
        </>
    );
};

const loginButton = {
    color: '#FFFFFF',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    fontWeight: '500',
};

const signUpButton = {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease-in-out',
};

const hoverEffect = (e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)');
const resetEffect = (e) => (e.target.style.backgroundColor = 'transparent');
const hoverSignUp = (e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)');
const resetSignUp = (e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)');

export default AuthButtons;
