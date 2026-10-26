import { Module } from '@nestjs/common';
import { FastifyMulterModule } from '../../../src';
import { MulterController, NestMultipartController } from './app.controller';

@Module({
  imports: [FastifyMulterModule],
  controllers: [MulterController],
})
export class MulterAppModule {}

@Module({
  imports: [FastifyMulterModule],
  controllers: [MulterController, NestMultipartController],
})
export class AppModule {}
