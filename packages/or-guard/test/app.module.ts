import { Module } from '@nestjs/common';

import { AndGuard } from '../src/';
import { AppController } from './app.controller';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';
import { ThrowGuard } from './throw.guard';
import { SetUserGuard } from './set-user.guard';
import { ReadUserGuard } from './read-user.guard';

@Module({
  controllers: [AppController],
  providers: [
    ObsGuard,
    SyncGuard,
    PromGuard,
    ThrowGuard,
    SetUserGuard,
    ReadUserGuard,
    {
      provide: 'SyncAndProm',
      useClass: AndGuard([SyncGuard, PromGuard]),
    },
  ],
})
export class AppModule {}
