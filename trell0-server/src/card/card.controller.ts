import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import Card from './card';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  async createCard(@Body('name') name: string, @Body('idList') idList: string) {
    let card: Card;
    try {
      card = new Card(name, idList);
    } catch {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }

    const { status, statusText, data } = await this.cardService.createCard(
      card,
    );
    if (status === 200) {
      return {
        message: 'SUCCESS',
        status,
        ...data,
      };
    } else {
      return {
        message: statusText,
        status,
      };
    }
  }
}
