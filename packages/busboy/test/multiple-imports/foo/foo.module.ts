import { Module } from '@nestjs/common';
import { BusboyModule, memoryStorage } from '../../../src';

@Module({
  imports: [
    BusboyModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
  ],
})
export class FooModule {}
