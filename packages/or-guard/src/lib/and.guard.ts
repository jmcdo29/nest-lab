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
import { catchError, last, mergeMap, every } from 'rxjs/operators';

interface OrGuardOptions {
  throwOnFirstError?: boolean;
}

export function AndGuard(
  guards: Array<Type<CanActivate> | InjectionToken>,
  orGuardOptions?: OrGuardOptions
) {
  class AndMixinGuard implements CanActivate {
    private guards: CanActivate[] = [];
    constructor(@Inject(ModuleRef) private readonly modRef: ModuleRef) {}
    canActivate(context: ExecutionContext): Observable<boolean> {
      this.guards = guards.map((guard) => this.modRef.get(guard));
      const canActivateReturns: Array<Observable<boolean>> = this.guards.map(
        (guard) => this.deferGuard(guard, context)
      );
      return from(canActivateReturns).pipe(
        mergeMap((obs) => {
          return obs.pipe(this.handleError());
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
        if (orGuardOptions?.throwOnFirstError) {
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
