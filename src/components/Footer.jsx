import React from 'react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.content}>
                <p>Left-Aligned Text Section</p>
                <button style={styles.button} onClick={scrollToTop}>
                    Scroll to Top
                </button>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px',
        position: 'relative',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    button: {
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Footer;