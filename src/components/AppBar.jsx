import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const AppBar = () => {
    const [profileLetter, setProfileLetter] = useState('');
    const [userDetails, setUserDetails] = useState(null); // Store user details for the popup
    const [showPopup, setShowPopup] = useState(false); // Control popup visibility
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const firstLetter = (user.displayName?.[0] || user.email?.[0] || '').toUpperCase();
                setProfileLetter(firstLetter);
                setUserDetails({
                    displayName: user.displayName || 'N/A',
                    email: user.email,
                    phoneNumber: user.phoneNumber || 'N/A',
                    photoURL: user.photoURL || 'N/A',
                    providerId: user.providerId,
                    uid: user.uid,
                });
            } else {
                setProfileLetter('');
                setUserDetails(null);
            }
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []);

    // Close popup if user clicks outside
    const handleOutsideClick = (e) => {
        if (e.target.id === 'popup-overlay') {
            setShowPopup(false);
        }
    };

    return (
        <>
            <nav
                style={{
                    backgroundColor: '#000',
                    position: 'fixed',
                    width: '100%',
                    top: 0,
                    zIndex: 1000, // Updated zIndex to 1000
                    padding: '1rem 0',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    borderBottom: '1px solid white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 1rem',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{ marginLeft: '-100px', fontSize: '2rem', cursor: 'pointer' }}
                        onClick={() => navigate('/home')} // Redirect to /home on click
                    >
                        👾
                    </div>

                    {/* Profile or Auth Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: 'auto' }}>
                        {profileLetter ? (
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setShowPopup(true)} // Show popup
                                title="Profile"
                            >
                                <span style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                                    {profileLetter}
                                </span>
                            </div>
                        ) : (
                            <>
                                <button
                                    style={{
                                        color: '#FFFFFF',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease-in-out',
                                        fontWeight: '500',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button
                                    style={{
                                        color: '#FFFFFF',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                    onMouseOver={(e) =>
                                        (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')
                                    }
                                    onMouseOut={(e) =>
                                        (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
                                    }
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Popup */}
            {showPopup && (
                <div
                    id="popup-overlay"
                    onClick={handleOutsideClick}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#000',
                            color: 'white',
                            border: '2px solid white',
                            borderRadius: '8px',
                            padding: '2rem',
                            width: '500px',
                            height: '500px',
                            overflowY: 'auto',
                        }}
                    >
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>User Profile</h2>
                        <p><strong>Display Name:</strong> {userDetails?.displayName}</p>
                        <p><strong>Email:</strong> {userDetails?.email}</p>
                        <p><strong>Phone Number:</strong> {userDetails?.phoneNumber}</p>
                        <p><strong>Photo URL:</strong> {userDetails?.photoURL}</p>
                        <p><strong>Provider ID:</strong> {userDetails?.providerId}</p>
                        <p><strong>UID:</strong> {userDetails?.uid}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppBar;
