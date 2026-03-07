import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BUSBOY_OPTIONS } from '../files.constants';
import type { BusboyModuleOptions, BusboyOptions } from '../interfaces';
import { parseMultipart } from '../utils/parse-multipart';
import { transformException } from '../utils/transform-exception';

export function FileInterceptor(
  fieldName: string,
  localOptions?: BusboyOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    constructor(
      @Optional()
      @Inject(BUSBOY_OPTIONS)
      private readonly options: BusboyModuleOptions = {},
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const req = context.switchToHttp().getRequest();
      const mergedOptions = { ...this.options, ...localOptions };

      try {
        const { files, body } = await parseMultipart(req, mergedOptions, 'single', {
          fieldName,
        });
        req.file = files[0] ?? undefined;
        req.body = body;
      } catch (err) {
        throw transformException(err as Error);
      }

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
