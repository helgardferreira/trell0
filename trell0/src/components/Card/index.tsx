import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { CardModel } from "../../store/model/card-list.model";

const CardBackground = styled.div`
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
`;

const Card: FunctionComponent<CardModel> = ({ name }) => {
  return <CardBackground>{name}</CardBackground>;
};

export default Card;
