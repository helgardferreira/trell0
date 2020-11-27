import { BoardModel } from "../model/board.model";

export const SET_BOARD = "SET_BOARD";

export interface SetBoardAction {
  type: typeof SET_BOARD;
  payload: BoardModel;
}

export type BoardAction = SetBoardAction;

export const setBoard = (board: BoardModel): SetBoardAction => {
  return {
    type: SET_BOARD,
    payload: board,
  };
};
