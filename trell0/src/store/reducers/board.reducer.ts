import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { BoardAction, SET_BOARD, setBoard } from "../actions/board.actions";

import { ApplicationState } from "../model";
import { BoardModel } from "../model/board.model";

export const boardReducer: Reducer<BoardModel, BoardAction> = (
  state = {
    closed: false,
    desc: "",
    id: "",
    name: "",
    pinned: false,
    shortUrl: "",
    url: "",
  },
  action
) => {
  switch (action.type) {
    case SET_BOARD:
      return action.payload;
    default:
      return state;
  }
};

export const loadBoard = (): ThunkAction<
  void,
  ApplicationState,
  unknown,
  BoardAction
> => async (dispatch) => {
  try {
    const board: BoardModel = await fetch(
      "http://localhost:4000/boards/5fb6629327dbe95c234fed3d"
    ).then((res) => res.json());

    dispatch(setBoard(board));
  } catch {
    alert("Cannot contact backend!");
  }
};
