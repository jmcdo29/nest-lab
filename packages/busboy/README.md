# @nest-lab/busboy

File upload support for NestJS that works with **both** the Fastify and Express adapters, built directly on [`@fastify/busboy`](https://github.com/fastify/busboy) (the underlying multipart parser).

This package replaces [`@nest-lab/fastify-multer`](../fastify-multer/README.md), which depends on the unmaintained `fastify-multer` library and does not support Fastify v5.

## Installation

```shell
npm i @nest-lab/busboy
yarn add @nest-lab/busboy
pnpm i @nest-lab/busboy
```

## Usage

Use this exactly like you would the [`MulterModule`](https://docs.nestjs.com/techniques/file-upload) from `@nestjs/platform-express`. The same interceptors, storage engines, and options are supported.

You **must** import `BusboyModule` somewhere in your application so that the `multipart/form-data` content-type parser is registered with Fastify (on Express this step is a no-op).

### Basic setup

```typescript
import { BusboyModule } from '@nest-lab/busboy';

@Module({
  imports: [BusboyModule],
})
export class AppModule {}
```

### Module-level options

```typescript
import { BusboyModule, memoryStorage } from '@nest-lab/busboy';

@Module({
  imports: [
    BusboyModule.register({
      storage: memoryStorage(),
    }),
  ],
})
export class AppModule {}
```

### Async options

```typescript
@Module({
  imports: [
    BusboyModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        dest: config.get('UPLOAD_DIR'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Interceptors

All interceptors accept an optional `localOptions` argument that is merged with module-level options.

```typescript
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  NoFilesInterceptor,
  memoryStorage,
} from '@nest-lab/busboy';

@Controller('upload')
export class UploadController {
  // Single file from field "file"
  @Post('single')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadSingle(@UploadedFile() file: Express.Multer.File) { ... }

  // Up to 10 files from field "files"
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) { ... }

  // Any files from any field
  @Post('any')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  uploadAny(@UploadedFiles() files: Express.Multer.File[]) { ... }

  // Named fields
  @Post('fields')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar' }, { name: 'cover', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  uploadFields(@UploadedFiles() files: { avatar?: Express.Multer.File[]; cover?: Express.Multer.File[] }) { ... }

  // No files allowed — parses form fields only
  @Post('form')
  @UseInterceptors(NoFilesInterceptor())
  formData(@Body() body: Record<string, string>) { ... }
}
```

### Storage engines

#### Memory storage (default)

Files are buffered in memory as `Buffer` objects. This is the default when neither `storage` nor `dest` is specified.

```typescript
import { memoryStorage } from '@nest-lab/busboy';

FileInterceptor('file', { storage: memoryStorage() })
```

#### Disk storage

Files are written to disk. The destination directory is created automatically.

```typescript
import { diskStorage } from '@nest-lab/busboy';

FileInterceptor('file', {
  storage: diskStorage({
    destination: '/uploads',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
})
```

Or use the `dest` shorthand (generates random filenames):

```typescript
BusboyModule.register({ dest: '/uploads' })
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `storage` | `StorageEngine` | Custom storage engine. Defaults to `MemoryStorage`. |
| `dest` | `string` | Destination directory. Uses `DiskStorage` with random filenames. |
| `fileFilter` | `FileFilter` | Function to control which files are accepted. |
| `limits` | `BusboyLimits` | Limits on incoming data (file size, file count, etc.). |
| `preservePath` | `boolean` | Preserve the full path of the original filename. |

## Migrating from `@nest-lab/fastify-multer`

1. Replace `@nest-lab/fastify-multer` with `@nest-lab/busboy` in your dependencies.
2. Replace `FastifyMulterModule` with `BusboyModule` in your imports.
3. Replace `memoryStorage` / `diskStorage` imports — they now come from `@nest-lab/busboy` directly instead of `fastify-multer/lib`.

```diff
-import { FastifyMulterModule } from '@nest-lab/fastify-multer';
-import { memoryStorage } from 'fastify-multer/lib';
+import { BusboyModule, memoryStorage } from '@nest-lab/busboy';

-FastifyMulterModule.register({ ... })
+BusboyModule.register({ ... })
```

All interceptor names and options are identical.
