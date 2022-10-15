import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { FastifyMulterModule } from '../../../src';
import { AppController } from './app.controller';

@Module({
  imports: [
    FastifyMulterModule.register({
      dest: join(process.cwd(), 'uploads'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
