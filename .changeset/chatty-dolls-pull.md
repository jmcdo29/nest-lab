---
'@nest-lab/fastify-multer': patch
---

allow for multiple `registerAsync` calls

By moving the registration of the multipart content parse to a separate core module, the core module only gets activated once which allows for multiple `registerAsync` calls without calling the `fastify.register()` multiple times. This should resovle the error in #11.
