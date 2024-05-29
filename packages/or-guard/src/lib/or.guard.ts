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
  concatMap,
  defer,
  from,
  map,
  Observable,
  of,
  OperatorFunction,
  throwError,
  pipe,
} from 'rxjs';
import { catchError, last, mergeMap, takeWhile } from 'rxjs/operators';

interface OrGuardOptions {
  throwOnFirstError?: boolean;
  throwLastError?: boolean;
}

export function OrGuard(
  guards: Array<Type<CanActivate> | InjectionToken>,
  orGuardOptions?: OrGuardOptions
) {
  class OrMixinGuard implements CanActivate {
    private guards: CanActivate[] = [];
    constructor(@Inject(ModuleRef) private readonly modRef: ModuleRef) {}
    canActivate(context: ExecutionContext): Observable<boolean> {
      this.guards = guards.map((guard) =>
        this.modRef.get(guard, { strict: false })
      );
      const canActivateReturns: Array<Observable<boolean>> = this.guards.map(
        (guard) => this.deferGuard(guard, context)
      );
      return from(canActivateReturns).pipe(
        mergeMap((obs) => {
          return obs.pipe(this.handleError());
        }),
        takeWhile(({ result }) => result === false, true),
        last(),
        concatMap(({ result, error }) => result === false && orGuardOptions?.throwLastError && error ? throwError(() => error) : of(result))
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

    private handleError(): OperatorFunction<boolean, { result: boolean, error?: unknown }> {
      return pipe(
        catchError((error) => {
          if (orGuardOptions?.throwOnFirstError) {
            return throwError(() => error);
          }
          return of({ result: false, error });
        }),
        map((result) => typeof result === 'boolean' ? { result } : result)
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
