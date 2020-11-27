import React, { FunctionComponent, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { postNewCard } from "../../store/reducers/card-list.reducer";

const AddCardBackground = styled.button`
  background-color: transparent;
  padding: 4px 8px;
  border-radius: 3px;
  margin: 0;
  text-align: left;
  color: black;
  display: inline-block;
  cursor: pointer;
  font: inherit;
  border: none;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
    color: #172b4d;
  }
`;

const TextArea = styled.textarea`
  background-color: white;
  border: 0px;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  color: inherit;
  font: inherit;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #5aac44;
  box-shadow: none;
  color: #fff;
  cursor: pointer;
  font: inherit;
  padding: 4px 8px;
  border-radius: 3px;
  border: none;

  margin: 0 8px 0 0;
  text-align: left;
  color: white;
  display: inline-block;

  &:hover {
    background-color: #61bd4f;
  }
`;

const CloseIcon = styled.div`
  display: inline-block;
  font-weight: bold;
  cursor: pointer;
  width: 24px;
  color: black;
  font-size: 24px;
  line-height: 100%;
  text-align: center;
`;

interface AddCardProps {
  listId: string;
}

const AddCard: FunctionComponent<AddCardProps> = ({ listId }) => {
  const [isInputVisible, setInputVisibility] = useState(false);
  const [cardName, setName] = useState("");
  const dispatch = useDispatch();

  const onAddCard = useCallback(
    (name: string, idList: string) => {
      dispatch(postNewCard(name, idList));
    },
    [dispatch]
  );

  return !isInputVisible ? (
    <AddCardBackground onClick={() => setInputVisibility(true)}>
      + Add another card
    </AddCardBackground>
  ) : (
    <>
      <TextArea
        rows={3}
        name="card-title"
        placeholder="Enter a title for this card..."
        value={cardName}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <SubmitButton
          type="button"
          onClick={() => {
            onAddCard(cardName, listId);
            setInputVisibility(false);
            setName("");
          }}
        >
          Add Card
        </SubmitButton>
        <CloseIcon
          onClick={() => {
            setInputVisibility(false);
            setName("");
          }}
        >
          x
        </CloseIcon>
      </div>
    </>
  );
};

export default AddCard;
