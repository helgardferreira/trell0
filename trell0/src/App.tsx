import React, { FunctionComponent } from "react";

import DimCircle from "./components/WebGL/DimCircle";

// import logo from "./logo.svg";
import "./App.css";
import Board from "./components/Board";
import { Container } from "./components/Styled/Utils";
import CardListContainer from "./components/CardList";

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Board />

      <CardListContainer />

      <Container>
        <DimCircle />
      </Container>
    </div>
  );
};

export default App;
