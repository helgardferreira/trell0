export interface IList {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
  idBoard: string;
  subscribed: boolean;
}

export interface ICard {
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

export interface ICardList {
  list: IList;
  cards: ICard[];
}

export interface IBoard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  pinned: boolean;
  url: string;
  shortUrl: string;
}
