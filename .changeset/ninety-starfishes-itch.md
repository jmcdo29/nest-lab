---
'@nest-lab/busboy': major
'@nest-lab/fastify-multer': minor
---

Add @nest-lab/busboy — file upload support for NestJS that works with both the Fastify and Express adapters, built directly on @fastify/busboy. Fixes compatibility with Fastify v5, which broke @nest-lab/fastify-multer due to stricter content-type parser matching. Supports the same interceptors (FileInterceptor, FilesInterceptor, FileFieldsInterceptor, AnyFilesInterceptor, NoFilesInterceptor), storage engines (memoryStorage, diskStorage), and options as @nestjs/platform-express's MulterModule.
