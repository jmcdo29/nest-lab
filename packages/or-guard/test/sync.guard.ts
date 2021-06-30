import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SyncGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
