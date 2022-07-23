import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import multer from 'fastify-multer';
import { Observable } from 'rxjs';
import { MULTER_MODULE_OPTIONS } from '../files.constants';
import { MulterModuleOptions } from '../interfaces';
import { transformException } from '../multer/multer.utils';

type MulterInstance = ReturnType<typeof multer['default']>;

export function NoFilesInterceptor(): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {}
    ) {
      this.multer = multer({
        ...options,
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler
    ): Promise<Observable<unknown>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        // @ts-expect-errornot using method as pre-handler, so signature is different
        this.multer.none()(
          ctx.getRequest(),
          ctx.getResponse(),
          (err: Error) => {
            if (err) {
              const error = transformException(err);
              return reject(error);
            }
            resolve();
          }
        )
      );
      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
