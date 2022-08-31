import { Module } from '@nestjs/common';
import { memoryStorage } from 'fastify-multer/lib';
import { FastifyMulterModule } from '../../../src';

@Module({
  imports: [
    FastifyMulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
  ],
})
export class FooModule {}
