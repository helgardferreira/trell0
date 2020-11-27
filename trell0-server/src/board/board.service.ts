import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBoard, ICard, ICardList, IList } from './board.interface';

interface EnvironmentVariables {
  API_KEY: string;
  API_TOKEN: string;
}

@Injectable()
export class BoardService {
  private readonly API_KEY: string;
  private readonly API_TOKEN: string;

  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private httpService: HttpService,
  ) {
    this.API_KEY = this.configService.get<string>('API_KEY');
    this.API_TOKEN = this.configService.get<string>('API_TOKEN');
  }

  getBoard(boardId: string) {
    return this.httpService
      .get<IBoard>(
        `https://api.trello.com/1/boards/${boardId}?key=${this.API_KEY}&token=${this.API_TOKEN}`,
      )
      .toPromise();
  }

  getLists(boardId: string) {
    return this.httpService
      .get<IList[]>(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${this.API_KEY}&token=${this.API_TOKEN}`,
      )
      .toPromise();
  }

  getBoardCards(boardId: string) {
    return this.httpService
      .get<ICard[]>(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${this.API_KEY}&token=${this.API_TOKEN}`,
      )
      .toPromise();
  }

  async getListsAndCards(boardId: string) {
    const lists = (await this.getLists(boardId)).data;
    const cards = (await this.getBoardCards(boardId)).data;

    const cardLists: { data: ICardList[] } = { data: undefined };

    cardLists.data = cards.reduce<ICardList[]>((acc, cur) => {
      const cardList = acc.find((cardList) => cardList.list.id === cur.idList);

      cardList.cards.push(cur);

      return acc;
    }, lists.map((list) => ({ cards: [], list })) as ICardList[]);

    return cardLists;
  }
}
