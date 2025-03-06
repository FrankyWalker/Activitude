import React from 'react';
import styled from 'styled-components';
import Terminal from '../courses/galaga/components/Terminal'; // Ensure it's correctly linked to your project

// Styled component for black background
const PlaygroundContainer = styled.div`
    background-color: black;
    height: 100vh;
    width: 100vw;
`;

const Playground = () => {
    return (
        <PlaygroundContainer>
            <Terminal />
        </PlaygroundContainer>
    );
};

export default Playground;