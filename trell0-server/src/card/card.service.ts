import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICard } from '../board/board.interface';
import Card from './card';

interface EnvironmentVariables {
  API_KEY: string;
  API_TOKEN: string;
}

@Injectable()
export class CardService {
  private readonly API_KEY: string;
  private readonly API_TOKEN: string;

  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private httpService: HttpService,
  ) {
    this.API_KEY = this.configService.get<string>('API_KEY');
    this.API_TOKEN = this.configService.get<string>('API_TOKEN');
  }

  createCard(card: Card) {
    const payload: Card & { key: string; token: string } = {
      ...card,
      key: this.API_KEY,
      token: this.API_TOKEN,
    };

    return this.httpService
      .post<ICard>('https://api.trello.com/1/cards', payload)
      .toPromise();
  }
}
