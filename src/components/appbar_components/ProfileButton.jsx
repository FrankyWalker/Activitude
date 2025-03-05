import React from 'react';

const ProfileButton = ({ profileLetter, onClick }) => {
    return (
        <div
            style={profileStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={onClick}
            title="Profile"
        >
            <span style={letterStyle}>{profileLetter}</span>
        </div>
    );
};

const profileStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
};

const letterStyle = {
    color: 'black',
    fontWeight: 'bold',
    fontSize: '18px',
};

export default ProfileButton;
