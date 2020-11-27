import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
