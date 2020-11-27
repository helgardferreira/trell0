import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { IBoard } from 'src/board/board.interface';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/boards/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/boards/5fb6629327dbe95c234fed3d')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toMatchObject<IBoard>({
          id: '5fb6629327dbe95c234fed3d',
          name: 'The Pizza Project',
          desc: '',
          closed: false,
          pinned: false,
          url: 'https://trello.com/b/EaAtuyUu/the-pizza-project',
          shortUrl: 'https://trello.com/b/EaAtuyUu',
        });
      });
  });
});
