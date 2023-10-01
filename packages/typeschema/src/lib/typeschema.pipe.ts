import { ValidationIssue, validate } from '@decs/typeschema';
import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Optional,
  PipeTransform,
} from '@nestjs/common';

import { TypeschemaDto } from './typeschema.dto';
import { TypeschemaOptions } from './typeschema.constants';
import { ValidationPipeOptions } from './typeschema-options.interface';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(
    @Optional()
    @Inject(TypeschemaOptions)
    private readonly options: ValidationPipeOptions,
    @Optional() protected readonly logger?: Logger
  ) {}
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.isTypeschemaDto(metadata.metatype)) {
      return value;
    }
    const result = await validate(metadata.metatype.schema, value);
    if (!result.success) {
      this.logger?.error(result.issues, undefined, 'ValidationPipe');
      throw (
        this.options?.exceptionFactory?.(result.issues) ??
        this.exceptionFactory(result.issues)
      );
    }
    return new metadata.metatype(result.data);
  }

  protected isTypeschemaDto(
    type: unknown
  ): type is ReturnType<typeof TypeschemaDto> {
    return (
      typeof type === 'function' &&
      '_typeschema' in type &&
      type._typeschema === true
    );
  }

  protected exceptionFactory(issues: ValidationIssue[]) {
    return new BadRequestException(issues);
  }
}
