import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ThrowGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    throw new UnauthorizedException(ThrowGuard.name);
  }
}
