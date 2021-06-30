import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';

@Module({
  controllers: [AppController],
  providers: [ObsGuard, SyncGuard, PromGuard],
})
export class AppModule {}
