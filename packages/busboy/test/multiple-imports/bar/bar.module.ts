import { Module } from '@nestjs/common';
import { BusboyModule, diskStorage } from '../../../src';

@Module({
  imports: [
    BusboyModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({ destination: '/tmp/uploads/' }),
      }),
    }),
  ],
})
export class BarModule {}
