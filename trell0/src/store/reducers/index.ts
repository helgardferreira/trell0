import { combineReducers } from "redux";
import { boardReducer } from "./board.reducer";
import { cardListsReducer } from "./card-list.reducer";

export default combineReducers({
  board: boardReducer,
  cardLists: cardListsReducer,
});
