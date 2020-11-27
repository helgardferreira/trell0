import { Controller, Get, Param } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get(':id')
  async getBoard(@Param('id') id: string) {
    const { data } = await this.boardService.getBoard(id);

    return data;
  }

  @Get(':id/lists')
  async getLists(@Param('id') id: string) {
    const { data } = await this.boardService.getLists(id);

    return data;
  }

  @Get(':id/cards')
  async getBoardCards(@Param('id') id: string) {
    const { data } = await this.boardService.getBoardCards(id);

    return data;
  }

  @Get(':id/cards-lists')
  async getListsAndCards(@Param('id') id: string) {
    const { data } = await this.boardService.getListsAndCards(id);

    return data;
  }
}
