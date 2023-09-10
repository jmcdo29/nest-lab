import { validate } from '@decs/typeschema';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  Optional,
  PipeTransform,
} from '@nestjs/common';

import { TypeschemaDto } from './typeschema.dto';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(@Optional() protected readonly logger?: Logger) {}
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.isTypeschemaDto(metadata.metatype)) {
      return value;
    }
    const result = await validate(metadata.metatype.schema, value);
    if (!result.success) {
      this.logger?.error(result.issues, undefined, 'ValidationPipe');
      throw new BadRequestException(result.issues);
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
}
