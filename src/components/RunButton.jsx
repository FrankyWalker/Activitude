import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner, faCheck, faChevronDown, faBug, faHammer, faCodeBranch, faStop } from '@fortawesome/free-solid-svg-icons';

const RunButton = ({ onCommandSelect }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showOptionsPopup, setShowOptionsPopup] = useState(false);
    const [buttonMode, setButtonMode] = useState('run'); // 'run', 'loading', 'done', 'error'
    const [selectedOption, setSelectedOption] = useState('cargo run');
    const [isRunning, setIsRunning] = useState(false);

    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const options = [
        {
            id: 'cargo run',
            label: 'cargo run',
            icon: faPlay,
            description: 'Compile and execute the current project'
        },
        {
            id: 'cargo build',
            label: 'cargo build',
            icon: faHammer,
            description: 'Compile the current project without running'
        },
        {
            id: 'cargo clippy',
            label: 'cargo clippy',
            icon: faCodeBranch,
            description: 'Run the Rust linter for code analysis'
        },
        {
            id: 'cargo debug',
            label: 'cargo debug',
            icon: faBug,
            description: 'Run with debug symbols and verbose logging'
        }
    ];

    const handleOptionClick = (option) => {
        setSelectedOption(option.id);
        setShowOptionsPopup(false);
        console.log(`${option.id} selected`);
    };

    const handlePopupToggle = (e) => {
        e.stopPropagation();
        setShowOptionsPopup((prev) => !prev);
    };


    const handleRunClick = () => {
        if (isRunning) {
            if (onCommandSelect) {
                onCommandSelect('Ctrl+C');
            } else if (window.executeTerminalCommand) {
                window.executeTerminalCommand('Ctrl+C');
            } else {
                document.dispatchEvent(
                    new CustomEvent('terminal:execute', {
                        detail: { command: 'Ctrl+C' },
                    })
                );
            }
            setIsRunning(false);
            setButtonMode('done');
            setTimeout(() => setButtonMode('run'), 1500);
            return;
        }

        if (buttonMode === 'loading' || isRunning) return;

        setButtonMode('loading');
        setIsRunning(true);

        if (onCommandSelect) {
            onCommandSelect(selectedOption);
        } else if (window.executeTerminalCommand) {
            window.executeTerminalCommand(selectedOption);
        } else {
            document.dispatchEvent(
                new CustomEvent('terminal:execute', {
                    detail: { command: selectedOption },
                })
            );
        }
    };

    const getButtonContent = () => {
        switch (buttonMode) {
            case 'loading':
                return (
                    <>
                        {isRunning ? (
                            <FontAwesomeIcon icon={faStop} style={iconStyles} />
                        ) : (
                            <FontAwesomeIcon icon={faSpinner} spin style={iconStyles} />
                        )}
                        <span>{isRunning ? 'Stop' : 'Loading...'}</span>
                    </>
                );
            case 'done':
                return (
                    <>
                        <FontAwesomeIcon icon={faCheck} style={iconStyles} />
                        <span>Done</span>
                    </>
                );
            case 'error':
                return (
                    <>
                        <FontAwesomeIcon icon={faBug} style={iconStyles} />
                        <span>Error</span>
                    </>
                );
            default:
                return (
                    <>
                        <FontAwesomeIcon icon={faPlay} style={iconStyles} />
                        <span>Run</span>
                    </>
                );
        }
    };

    return (
        <div style={runButtonContainer}>
            <button
                ref={buttonRef}
                style={{
                    ...runButtonStyles,
                    backgroundColor: buttonMode === 'done' ? '#12ca8d' :
                        buttonMode === 'error' ? '#ff3a54' :
                            buttonMode === 'loading' ? (isRunning ? '#fd6d41' : '#2d3748') :
                                isHovered ? '#10e17b' : '#00cf63',
                    opacity: buttonMode === 'loading' ? 0.95 : 1,
                    boxShadow: isHovered && buttonMode === 'run'
                        ? '0 3px 8px rgba(0, 207, 99, 0.5)'
                        : buttonMode === 'error' ? '0 3px 8px rgba(255, 58, 84, 0.4)'
                            : buttonMode === 'done' ? '0 3px 8px rgba(18, 202, 141, 0.4)'
                                : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transform: isHovered && buttonMode === 'run' ? 'translateY(-1px)' : 'none',
                }}
                onClick={handleRunClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {getButtonContent()}
            </button>

            <div
                style={{
                    ...dropdownButtonStyles,
                    backgroundColor: isHovered ? '#414b5a' : '#2f3a4d',
                    boxShadow: isHovered ? '0 3px 8px rgba(45, 55, 72, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transform: isHovered ? 'translateY(-1px)' : 'none',
                }}
                onClick={handlePopupToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FontAwesomeIcon icon={faChevronDown} style={arrowIconStyles} />
            </div>

            {showOptionsPopup && (
                <div ref={popupRef} style={optionsPopupStyles}>
                    {options.map((option) => (
                        <div key={option.id} style={optionContainerStyles}>
                            <button
                                onClick={() => handleOptionClick(option)}
                                style={{
                                    ...optionButtonStyles,
                                    backgroundColor: selectedOption === option.id ? '#1e2a3e' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedOption !== option.id) {
                                        e.target.style.backgroundColor = '#2a3647';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedOption !== option.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={option.icon} style={{
                                    ...optionIconStyles,
                                    color: option.id === 'cargo run' ? '#00cf63' :
                                        option.id === 'cargo build' ? '#0d96ff' :
                                            option.id === 'cargo clippy' ? '#a48aff' : '#12ca8d'
                                }} />
                                <span>{option.label}</span>
                                {selectedOption === option.id && (
                                    <FontAwesomeIcon icon={faCheck} style={checkmarkStyles} />
                                )}
                            </button>
                            <div style={optionDescriptionStyles}>
                                {option.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const runButtonContainer = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '120px',
    height: '36px',
    fontFamily: 'IBM Plex Mono, Consolas, Monaco, "Andale Mono", monospace',
};

const runButtonStyles = {
    color: '#ffffff',
    backgroundColor: '#00cf63',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    padding: '0 0.6rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '80%',
    letterSpacing: '0.2px',
};

const dropdownButtonStyles = {
    backgroundColor: '#2f3a4d',
    borderRadius: '0 4px 4px 0',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '20%',
};

const iconStyles = {
    marginRight: '0.4rem',
    fontSize: '0.75rem',
};

const arrowIconStyles = {
    color: '#fff',
    fontSize: '0.75rem',
};

const optionsPopupStyles = {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    right: '0',
    backgroundColor: '#1a2133',
    borderRadius: '6px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    width: '220px',
    overflow: 'hidden',
    zIndex: 100,
    border: '1px solid #2d3a4f',
};

const optionContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #2d3a4f',
};

const optionButtonStyles = {
    backgroundColor: 'transparent',
    color: '#e8edf5',
    border: 'none',
    padding: '0.75rem 0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.82rem',
    transition: 'background-color 0.15s ease, transform 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
};

const optionIconStyles = {
    marginRight: '0.75rem',
    fontSize: '0.75rem',
    color: '#a48aff',
};

const checkmarkStyles = {
    position: 'absolute',
    right: '10px',
    fontSize: '0.7rem',
    color: '#9da8b8',
};

const optionDescriptionStyles = {
    fontSize: '0.7rem',
    color: '#9da8b8',
    padding: '0.3rem 0.8rem 0.7rem 2.35rem',
    backgroundColor: '#151d2c',
    lineHeight: '1.4',
};

export default RunButton;
