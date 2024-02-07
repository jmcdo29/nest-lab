import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { setTimeout } from 'timers/promises';

@Injectable()
export class SetUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await setTimeout(500);
    const req = context.switchToHttp().getRequest();
    req.user = 'set';
    return true;
  }
}
