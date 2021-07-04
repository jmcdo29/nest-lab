import { Controller, Get, UseGuards } from '@nestjs/common';

import { OrGuard } from '../src';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';
import { ThrowGuard } from './throw.guard';

@Controller()
export class AppController {
  private message = 'Hello World';
  @UseGuards(OrGuard([ObsGuard, PromGuard, SyncGuard]))
  @Get()
  getHello() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, SyncGuard]))
  @Get('do-not-throw')
  getThrowGuard() {
    return this.message;
  }

  @UseGuards(OrGuard([ThrowGuard, SyncGuard], { throwOnFirstError: true }))
  @Get('throw')
  getThrowGuardThrow() {
    return this.message;
  }
}
