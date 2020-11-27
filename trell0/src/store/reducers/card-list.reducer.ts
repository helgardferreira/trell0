import { Reducer } from "react";
import { ThunkAction } from "redux-thunk";
import {
  addCard,
  ADD_CARD,
  CardListsAction,
  setCardLists,
  SET_CARD_LISTS,
} from "../actions/card-list.actions";
import { ApplicationState } from "../model";
import { CardListModel, CardModel } from "../model/card-list.model";

export const cardListsReducer: Reducer<CardListModel[], CardListsAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case SET_CARD_LISTS:
      return action.payload;
    case ADD_CARD: {
      const listIndex = state.findIndex(
        (cardList) => cardList.list.id === action.payload.idList
      );
      if (listIndex === -1) return state;

      const foundCardList = state[listIndex];
      return [
        ...state.slice(0, listIndex),
        { ...foundCardList, cards: [...foundCardList.cards, action.payload] },
        ...state.slice(listIndex + 1),
      ];
    }
    default:
      return state;
  }
};

export const loadCardLists = (): ThunkAction<
  void,
  ApplicationState,
  unknown,
  CardListsAction
> => async (dispatch) => {
  try {
    const cardLists: CardListModel[] = await fetch(
      "http://localhost:4000/boards/5fb6629327dbe95c234fed3d/cards-lists"
    )
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        return res;
      })
      .then((res) => res.json());

    dispatch(setCardLists(cardLists));
  } catch (er) {
    alert(
      `Cannot contact backend!\n${er}\nHave you configured the server's .env with the appropriate credentials?`
    );
    console.error(er);
  }
};

export const postNewCard = (
  name: string,
  idList: string
): ThunkAction<void, ApplicationState, unknown, CardListsAction> => async (
  dispatch
) => {
  try {
    const card: CardModel = await fetch("http://localhost:4000/cards", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        idList,
      }),
    })
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        return res;
      })
      .then((res) => res.json());

    dispatch(addCard(card));
  } catch (er) {
    alert(
      `Cannot contact backend!\n${er}\nHave you configured the server's .env with the appropriate credentials?`
    );
    console.error(er);
  }
};
