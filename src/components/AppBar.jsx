import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import ProfileButton from './appbar_components/ProfileButton';
import AuthButtons from './appbar_components/AuthButtons';
import ProfilePopup from './appbar_components/ProfilePopup';
import WogoType from '../assets/wogo_type.png';

const AppBar = () => {
    const [profileLetter, setProfileLetter] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const firstLetter = (user.displayName?.[0] || user.email?.[0] || '').toUpperCase();
                setProfileLetter(firstLetter);
                setUserDetails({
                    displayName: user.displayName || 'N/A',
                    email: user.email,
                    photoURL: user.photoURL || 'N/A',
                    providerId: user.providerId,
                    uid: user.uid,
                });
            } else {
                setProfileLetter('');
                setUserDetails(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <nav style={navStyles}>
                <div style={navContainer}>
                    <div style={logoStyle} onClick={() => navigate('/home')}>
                        <img
                            src={WogoType}
                            alt="Logo"
                            style={{ height: '50px' }}
                        />
                    </div>
                    <div style={navLinksContainer}>
                        <button
                            style={navButtonStyle}
                            onClick={() => navigate('/dockerstatus')}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#ff7700';
                                e.target.style.borderBottom = '2px solid #ff7700';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#ffffff';
                                e.target.style.borderBottom = '2px solid transparent';
                            }}
                        >
                            docker
                        </button>
                        <button
                            style={navButtonStyle}
                            onClick={() => navigate('/playground')}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#ff7700';
                                e.target.style.borderBottom = '2px solid #ff7700';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#ffffff';
                                e.target.style.borderBottom = '2px solid transparent';
                            }}
                        >
                            playground
                        </button>
                    </div>
                    <div style={authContainer}>
                        {profileLetter ? (
                            <ProfileButton profileLetter={profileLetter} onClick={() => setShowPopup(true)} />
                        ) : (
                            <AuthButtons navigate={navigate} />
                        )}
                    </div>
                </div>
            </nav>

            {showPopup && (
                <ProfilePopup userDetails={userDetails} profileLetter={profileLetter} onClose={() => setShowPopup(false)} />
            )}
        </>
    );
};

const navStyles = {
    backgroundColor: '#050a18',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    padding: '1rem 0',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    borderBottom: '2px solid #ff7700',
};

const navContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
};

const logoStyle = {
    cursor: 'pointer',
    marginLeft: '-70px',
};

const navLinksContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    gap: '2rem',
    marginLeft: '150px',
};

const navButtonStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 0.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'lowercase',
};

const authContainer = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
};

export default AppBar;
