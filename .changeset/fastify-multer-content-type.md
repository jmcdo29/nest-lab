---
'@nest-lab/fastify-multer': patch
---

Register the multipart content type parser as `multipart/form-data`. fastify
5.7.2 and later (used by `@nestjs/platform-fastify` 12 and recent 11.x releases)
reject the bare `multipart` type registered by `fastify-multer`'s
`contentParser`, which crashed the application on startup. The parser is skipped
when `@fastify/multipart` or another `isMultipart` decorator is already
registered, so the NestJS 12 upload interceptors keep working next to this
module.
