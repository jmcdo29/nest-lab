import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor as NestFileInterceptor } from '@nestjs/platform-fastify/multipart';
import { memoryStorage } from 'fastify-multer/lib';
import { FileInterceptor } from '../../../src';

@Controller()
export class MulterController {
  @Post('multer')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadFile(@UploadedFile() file: unknown) {
    return { success: !!file };
  }
}

@Controller()
export class NestMultipartController {
  @Post('nest')
  @UseInterceptors(NestFileInterceptor('file'))
  uploadFile(@UploadedFile() file: unknown) {
    return { success: !!file };
  }
}
