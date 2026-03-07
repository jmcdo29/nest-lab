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
import type { BusboyModuleOptions, BusboyOptions, MulterField, MulterFile } from '../interfaces';
import { parseMultipart } from '../utils/parse-multipart';
import { transformException } from '../utils/transform-exception';

export function FileFieldsInterceptor(
  uploadFields: MulterField[],
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
        const { files, body } = await parseMultipart(req, mergedOptions, 'fields', {
          uploadFields,
        });

        // Group files by fieldname into an object
        const grouped: Record<string, MulterFile[]> = {};
        for (const file of files) {
          if (!grouped[file.fieldname]) {
            grouped[file.fieldname] = [];
          }
          grouped[file.fieldname].push(file);
        }

        req.files = grouped;
        req.body = body;
      } catch (err) {
        throw transformException(err as Error);
      }

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
