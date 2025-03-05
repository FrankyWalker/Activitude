import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import ProfileButton from './appbar_components/ProfileButton';
import AuthButtons from './appbar_components/AuthButtons';
import ProfilePopup from './appbar_components/ProfilePopup';

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
                        👾
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
    backgroundColor: '#000',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    padding: '1rem 0',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid white',
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
    marginLeft: '-100px',
    fontSize: '2rem',
    cursor: 'pointer',
};

const authContainer = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginLeft: 'auto',
};



export default AppBar;
