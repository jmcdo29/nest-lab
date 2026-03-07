import { Module } from '@nestjs/common';
import { BusboyModule } from '../../../src';
import { AppController } from './app.controller';

@Module({
  imports: [BusboyModule],
  controllers: [AppController],
})
export class AppModule {}
