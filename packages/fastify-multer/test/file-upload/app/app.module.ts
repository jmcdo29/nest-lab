import { Module } from '@nestjs/common';
import { FastifyMulterModule } from '../../../src';
import { AppController } from './app.controller';

@Module({
  imports: [FastifyMulterModule],
  controllers: [AppController]
})
export class AppModule {}
