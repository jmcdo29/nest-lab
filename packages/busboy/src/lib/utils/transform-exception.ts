import {
  BadRequestException,
  HttpException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { busboyExceptions } from './busboy.constants';

export function transformException(error: Error | undefined) {
  if (!error || error instanceof HttpException) {
    return error;
  }
  switch (error.message) {
    case busboyExceptions.LIMIT_FILE_SIZE:
      return new PayloadTooLargeException(error.message);
    case busboyExceptions.LIMIT_FILE_COUNT:
    case busboyExceptions.LIMIT_FIELD_KEY:
    case busboyExceptions.LIMIT_FIELD_VALUE:
    case busboyExceptions.LIMIT_FIELD_COUNT:
    case busboyExceptions.LIMIT_UNEXPECTED_FILE:
    case busboyExceptions.LIMIT_PART_COUNT:
      return new BadRequestException(error.message);
  }
  return error;
}
