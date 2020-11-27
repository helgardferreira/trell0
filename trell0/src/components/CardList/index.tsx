import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { ApplicationState } from "../../store/model";
import { CardListModel } from "../../store/model/list.interface";
import { loadCardLists } from "../../store/reducers/card-list.reducer";
import AddCard from "../AddCard";
import Card from "../Card";

import { Container } from "../Styled/Utils";

const CardListGrid = styled.div`
  display: grid;
  grid-auto-columns: 272px;
  grid-auto-flow: column;
  gap: 8px;
  overflow-x: auto;
`;

const CardListBackground = styled.div`
  background-color: rgb(235, 236, 240);
  border-radius: 3px;
  padding: 10px;
  gap: 10px;
  display: grid;
  grid-auto-rows: max-content;
  height: max-content;
`;

const CardListName = styled.h3`
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const CardList: FunctionComponent<CardListModel> = ({ list, cards }) => {
  return (
    <CardListBackground>
      <CardListName>{list.name}</CardListName>
      {cards.map((card) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <Card key={card.id} {...card} />
        /* eslint-enable react/jsx-props-no-spreading */
      ))}
      <AddCard listId={list.id} />
    </CardListBackground>
  );
};

const CardListContainer: FunctionComponent = () => {
  const dispatch = useDispatch();

  const cardLists = useSelector<ApplicationState, CardListModel[]>((state) => {
    return state.cardLists;
  });

  const onLoadCardLists = useCallback(() => {
    dispatch(loadCardLists());
  }, [dispatch]);

  useEffect(() => {
    onLoadCardLists();
  }, [onLoadCardLists]);

  return (
    <section>
      <Container>
        <CardListGrid>
          {cardLists.map((cardList) => (
            <CardList
              key={cardList.list.id}
              list={cardList.list}
              cards={cardList.cards}
            />
          ))}
        </CardListGrid>
      </Container>
    </section>
  );
};

export default CardListContainer;
