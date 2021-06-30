import { Controller, Get, UseGuards } from '@nestjs/common';

import { OrGuard } from '../src';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';

@Controller()
export class AppController {
  @UseGuards(OrGuard([ObsGuard, PromGuard, SyncGuard]))
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
