import { BoardModel } from "./board.model";
import { CardListModel } from "./card-list.model";

export interface ApplicationState {
  board: BoardModel;
  cardLists: CardListModel[];
}
