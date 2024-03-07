import {
  CanActivate,
  ExecutionContext,
  Inject,
  InjectionToken,
  mixin,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  defer,
  from,
  Observable,
  of,
  OperatorFunction,
  throwError,
} from 'rxjs';
import { catchError, last, mergeMap, every, concatMap } from 'rxjs/operators';

interface AndGuardOptions {
  throwOnFirstError?: boolean;
  sequential?: boolean;
}

export function AndGuard(
  guards: Array<Type<CanActivate> | InjectionToken>,
  andGuardOptions?: AndGuardOptions
) {
  class AndMixinGuard implements CanActivate {
    private guards: CanActivate[] = [];
    constructor(@Inject(ModuleRef) private readonly modRef: ModuleRef) {}
    canActivate(context: ExecutionContext): Observable<boolean> {
      this.guards = guards.map((guard) =>
        this.modRef.get(guard, { strict: false })
      );
      const canActivateReturns: Array<() => Observable<boolean>> =
        this.guards.map((guard) => () => this.deferGuard(guard, context));
      const mapOperator = andGuardOptions?.sequential ? concatMap : mergeMap;
      return from(canActivateReturns).pipe(
        mapOperator((obs) => {
          return obs().pipe(this.handleError());
        }),
        every((val) => val === true),
        last()
      );
    }

    private deferGuard(
      guard: CanActivate,
      context: ExecutionContext
    ): Observable<boolean> {
      return defer(() => {
        const guardVal = guard.canActivate(context);
        if (this.guardIsPromise(guardVal)) {
          return from(guardVal);
        }
        if (this.guardIsObservable(guardVal)) {
          return guardVal;
        }
        return of(guardVal);
      });
    }

    private handleError(): OperatorFunction<boolean, boolean> {
      return catchError((err) => {
        if (andGuardOptions?.throwOnFirstError) {
          return throwError(() => err);
        }
        return of(false);
      });
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

  const Guard = mixin(AndMixinGuard);
  return Guard as Type<CanActivate>;
}
