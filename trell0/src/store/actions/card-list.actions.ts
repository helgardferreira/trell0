import { CardListModel, CardModel } from "../model/card-list.model";

export const SET_CARD_LISTS = "SET_CARD_LISTS";
export const ADD_CARD = "ADD_CARD";

export interface SetCardListsAction {
  type: typeof SET_CARD_LISTS;
  payload: CardListModel[];
}

export interface AddCardAction {
  type: typeof ADD_CARD;
  payload: CardModel;
}

export type CardListsAction = SetCardListsAction | AddCardAction;

export const setCardLists = (
  cardLists: CardListModel[]
): SetCardListsAction => {
  return {
    type: SET_CARD_LISTS,
    payload: cardLists,
  };
};

export const addCard = (card: CardModel): AddCardAction => {
  return {
    type: ADD_CARD,
    payload: card,
  };
};
