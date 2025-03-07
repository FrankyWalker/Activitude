import React from 'react';
import { signOutUser } from '../../firebase/firebase';

const ProfilePopup = ({ userDetails, profileLetter, onClose }) => {
    const handleSignOut = async () => {
        try {

            await signOutUser();

            localStorage.clear();

            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div
            id="popup-overlay"
            onClick={(e) => e.target.id === 'popup-overlay' && onClose()}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
                animation: 'fadeIn 0.3s forwards',
            }}
        >
            <div
                style={{
                    backgroundColor: '#111',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    width: '450px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                    animation: 'slideIn 0.3s forwards',
                    position: 'relative',
                }}
            >
                <div style={{
                    background: '#050a18',
                    borderRadius: '16px 16px 0 0',
                    padding: '2rem',
                    textAlign: 'center',
                    position: 'relative',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#050a18',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        border: '3px solid white',
                    }}>
                        {profileLetter}
                    </div>
                    <h2 style={{
                        fontSize: '1.75rem',
                        marginBottom: '0.5rem',
                        fontWeight: '600'
                    }}>
                        {userDetails?.displayName !== 'N/A' ? userDetails?.displayName : 'User'}
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '1rem' }}>{userDetails?.email}</p>

                    <button
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            padding: 0,
                        }}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                            Account Information
                        </h3>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                                    Email
                                </p>
                                <p style={{ fontSize: '1rem', fontWeight: '500' }}>{userDetails?.email}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                                    User ID
                                </p>
                                <p style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontFamily: 'monospace'
                                }}>
                                    {userDetails?.uid}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                            Authentication
                        </h3>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                                    Provider
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '8px',
                                    width: 'fit-content'
                                }}>
                                    <span style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: '#4F46E5',
                                        borderRadius: '50%',
                                    }}></span>
                                    <span style={{ fontWeight: '500' }}>{userDetails?.providerId}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <button
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;