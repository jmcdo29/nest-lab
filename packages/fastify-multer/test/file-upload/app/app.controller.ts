import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { memoryStorage } from 'fastify-multer/lib';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  NoFilesInterceptor,
} from '../../../src';

@Controller()
export class AppController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadSingleFile(@UploadedFile() file: unknown) {
    return { success: !!file };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('file', 10, { storage: memoryStorage() }))
  uploadMultipleFiles(@UploadedFiles() files: unknown[]) {
    return { success: !!files.length, fileCount: files.length };
  }

  @Post('any')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  uploadAnyFiles(@UploadedFiles() files: unknown[]) {
    return { success: !!files.length, fileCount: files.length };
  }

  @Post('fields')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile' }, { name: 'avatar' }], {
      storage: memoryStorage(),
    })
  )
  uploadFileFieldsFiles(
    @UploadedFiles() files: { profile?: unknown[]; avatar?: unknown[] }
  ) {
    return {
      success: !!((files.profile?.length ?? 0) + (files.avatar?.length ?? 0)),
      fileCount: (files.profile?.length ?? 0) + (files.avatar?.length ?? 0),
    };
  }

  @Post('none')
  @UseInterceptors(NoFilesInterceptor())
  noFilesAllowed(
    @Body() body: Record<string, string>,
    @UploadedFiles() files: unknown[],
    @UploadedFile() file: unknown
  ) {
    return { success: !files && !file && !!body };
  }
}
