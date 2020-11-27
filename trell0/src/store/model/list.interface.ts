export interface ListModel {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
  idBoard: string;
  subscribed: boolean;
}

export interface CardModel {
  id: string;
  name: string;
  desc: string;
  pos: number;
  closed: boolean;
  shortLink: string;
  dateLastActivity: string;
  idBoard: string;
  idList: string;
  idShort: number;
}

export interface CardListModel {
  list: ListModel;
  cards: CardModel[];
}
