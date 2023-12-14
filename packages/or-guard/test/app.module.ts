import { Module } from '@nestjs/common';

import { AndGuard } from '../src/';
import { AppController } from './app.controller';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';
import { ThrowGuard } from './throw.guard';

@Module({
  controllers: [AppController],
  providers: [
    ObsGuard,
    SyncGuard,
    PromGuard,
    ThrowGuard,
    {
      provide: 'SyncAndProm',
      useClass: AndGuard([SyncGuard, PromGuard]),
    },
  ],
})
export class AppModule {}
