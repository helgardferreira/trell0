import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { IBoard, IList } from './board.interface';
import { BoardService } from './board.service';
import { AxiosResponse } from 'axios';

describe('BoardController', () => {
  let boardController: BoardController;
  let boardService: BoardService;
  const testResponse: AxiosResponse = {
    data: {},
    status: 200,
    statusText: 'OK',
    config: {},
    headers: '',
  };

  beforeEach(async () => {
    const boardModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [BoardController],
      providers: [BoardService],
    }).compile();

    boardController = boardModule.get(BoardController);
    boardService = boardModule.get(BoardService);
  });

  describe('getBoard', () => {
    it(`should return "The Pizza Project" board`, async () => {
      const result: IBoard = {
        id: '5fb6629327dbe95c234fed3d',
        name: 'The Pizza Project',
        desc: '',
        closed: false,
        pinned: false,
        url: 'https://trello.com/b/EaAtuyUu/the-pizza-project',
        shortUrl: 'https://trello.com/b/EaAtuyUu',
      };
      jest.spyOn(boardService, 'getBoard').mockImplementation(
        () =>
          new Promise((resolve) => {
            const res: AxiosResponse<IBoard> = {
              ...testResponse,
              data: result,
            };
            resolve(res);
          }),
      );

      expect(
        await boardController.getBoard('5fb6629327dbe95c234fed3d'),
      ).toMatchObject<IBoard>(result);
    });
  });

  describe('getLists', () => {
    it(`should return "The Pizza Project" board's lists`, async () => {
      const result: IList[] = [
        {
          id: '5fb6629aed4bfa846ce4d55c',
          name: 'To do',
          pos: 1,
          closed: false,
          idBoard: '5fb6629327dbe95c234fed3d',
          subscribed: false,
        },
        {
          id: '5fb6629c088d4d8c13cab6b3',
          name: 'Doing',
          pos: 2,
          closed: false,
          idBoard: '5fb6629327dbe95c234fed3d',
          subscribed: false,
        },
      ];
      jest.spyOn(boardService, 'getLists').mockImplementation(
        () =>
          new Promise((resolve) => {
            const res: AxiosResponse<IList[]> = {
              ...testResponse,
              data: result,
            };
            resolve(res);
          }),
      );

      expect(
        await boardController.getLists('5fb6629327dbe95c234fed3d'),
      ).toMatchObject<IList[]>(result);
    });
  });
});
