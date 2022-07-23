# @nest-lab/fastify-multer

Support for File Uploads when using the [`@nestjs/platform-fastify`](https://docs.nestjs.com/techniques/performance) adapter, using the [`fastify-multer`](https://www.npmjs.com/package/fastify-multer) library.

## Installation

Simple install, 

```shell
npm i @nest-lab/fastify-multer
yarn add @nest-lab/fastify-multer
pnpm i @nest-lab/fastify-multer
```

## Usage

Use this exactly like you would the [`MulterModule`](https://docs.nestjs.com/techniques/file-upload) from `@nestjs/platform-express`. The only difference is there is also a `NoFilesInterceptor` for when you jsut want to parse `multipart/form-data` and you __must__ have `FastifyMulterModule` imported _somewhere_ so that the `multipart/form-data` content parser gets registered with fastify.
