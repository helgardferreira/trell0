import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { BoardModel } from "../../store/model/board.model";
import { ApplicationState } from "../../store/model";
import { loadBoard } from "../../store/reducers/board.reducer";
import { Container } from "../Styled/Utils";

const Heading = styled.h1`
  a {
    text-decoration: none;
    color: black;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Board: FunctionComponent = () => {
  const dispatch = useDispatch();

  const board = useSelector<ApplicationState, BoardModel>((state) => {
    return state.board;
  });

  const onLoadBoard = useCallback(() => {
    dispatch(loadBoard());
  }, [dispatch]);

  useEffect(() => {
    onLoadBoard();
  }, [onLoadBoard]);

  return (
    <section>
      <Container>
        <Heading>
          <a href={board.url}>{board.name}</a>
        </Heading>
      </Container>
    </section>
  );
};

export default Board;
