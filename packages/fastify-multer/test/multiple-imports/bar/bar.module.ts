import { Module } from '@nestjs/common';
import { diskStorage } from 'fastify-multer/lib';
import { FastifyMulterModule } from '../../../src';

@Module({
  imports: [
    FastifyMulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({ destination: '/tmp/uploads/' }),
      }),
    }),
  ],
})
export class BarModule {}
