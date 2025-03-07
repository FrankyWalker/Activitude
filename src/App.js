import React from "react";
import AppRoutes from "./Routes";
import styled from "styled-components";

const AppContainer = styled.div`
  background-color: #050a18; 
  min-height: 100vh;
  color: white; 
`;

function App() {
    return (
        <AppContainer>
            <AppRoutes />
        </AppContainer>
    );
}

export default App;