// AppBarCourse.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileButton from '../../../components/appbar_components/ProfileButton';
import ProfilePopup from '../../../components/appbar_components/ProfilePopup';
import { auth } from '../../../firebase/firebase';
import wogo from '../../../assets/wogo.png';
import RunButton from '../../../components/RunButton';
const AppBarCourse = ({ onShowTasks }) => {
    const [profileLetter, setProfileLetter] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

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
                    <div style={leftContainer}>
                        <div
                            style={imageContainer}
                            onClick={() => navigate('/#/home')}
                        >
                            <img
                                src={wogo}
                                alt="wogo"
                                style={imageStyles}
                            />
                        </div>
                        <button
                            style={leftButton}
                            onClick={onShowTasks}
                        >
                            Syllabus
                        </button>
                    </div>

                    {/*<RunButton /> */}

                    <div style={spacerStyles}></div>
                    <div style={authContainer}>
                        <ProfileButton
                            profileLetter={profileLetter || 'P'}
                            onClick={() => setShowProfilePopup(true)}
                        />
                    </div>
                </div>
            </nav>
            {showProfilePopup && (
                <ProfilePopup
                    userDetails={userDetails}
                    profileLetter={profileLetter || 'P'}
                    onClose={() => setShowProfilePopup(false)}
                />
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
    alignItems: 'center',
    maxWidth: '1900px',
    margin: '0 auto',
    padding: '0 1rem',
    justifyContent: 'space-between',
};

const leftContainer = {
    flex: 1,
    display: 'flex',
    gap: '1rem',
};

const spacerStyles = {
    flex: 1,
};

const authContainer = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: '100px',
};

const leftButton = {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    border: '2px solid transparent',
    borderRadius: '30px',
    padding: '0.6rem 1.6rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
};

const imageContainer = {
    cursor: 'pointer',
};

const imageStyles = {
    height: '40px',
    width: 'auto',
};

export default AppBarCourse;
