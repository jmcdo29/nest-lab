import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { from, Observable, of } from 'rxjs';
import { last, mergeAll, takeWhile } from 'rxjs/operators';

let counter = 0;

export function OrGuard(guards: Type<CanActivate>[]) {
  class OrMixinGuard implements CanActivate {
    private guards: CanActivate[] = [];
    constructor(@Inject(ModuleRef) private readonly modRef: ModuleRef) {}
    canActivate(context: ExecutionContext): Observable<boolean> {
      this.guards = guards.map((guard) => this.modRef.get(guard));
      const canActivateReturns: Array<
        boolean | Promise<boolean> | Observable<boolean>
      > = this.guards.map((guard) => guard.canActivate(context));
      const obsGuards: Observable<boolean>[] = canActivateReturns.map(
        (canActivateVal) => {
          if (this.guardIsPromise(canActivateVal)) {
            return from(canActivateVal);
          }
          if (this.guardIsObservable(canActivateVal)) {
            return canActivateVal;
          }
          return of(canActivateVal);
        }
      );
      return from(obsGuards).pipe(
        mergeAll(),
        takeWhile((val) => val === false, true),
        last()
      );
    }

    private guardIsPromise(
      guard: boolean | Promise<boolean> | Observable<boolean>
    ): guard is Promise<boolean> {
      return !!(guard as Promise<boolean>).then;
    }

    private guardIsObservable(
      guard: boolean | Observable<boolean>
    ): guard is Observable<boolean> {
      return !!(guard as Observable<boolean>).pipe;
    }
  }

  const Guard = mixin(OrMixinGuard);
  return Guard as Type<CanActivate>;
}
