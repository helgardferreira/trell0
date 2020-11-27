import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
