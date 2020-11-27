import { BoardModel } from "./board.model";
import { CardListModel } from "./list.interface";

export interface ApplicationState {
  board: BoardModel;
  cardLists: CardListModel[];
}
