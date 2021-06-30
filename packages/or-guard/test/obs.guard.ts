import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { of, Observable } from 'rxjs';

@Injectable()
export class ObsGuard implements CanActivate {
  canActivate(_context: ExecutionContext): Observable<boolean> {
    return of(true);
  }
}
