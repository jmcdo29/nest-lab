# @nest-lab/fastify-multer

## 1.1.0

### Minor Changes

- d72a963: export multer interface and use options from fastify-multer
- 0b750cd: add file interface from fastify multer

## 1.0.2

### Patch Changes

- 19eb008: Options now persist via being set in the module

## 1.0.1

### Patch Changes

- 0ab9b86: allow for multiple `registerAsync` calls

  By moving the registration of the multipart content parse to a separate core module, the core module only gets activated once which allows for multiple `registerAsync` calls without calling the `fastify.register()` multiple times. This should resovle the error in #11.

## 1.0.0

### Major Changes

- abacf8f: A File Upload package for NestJS when using fastify
