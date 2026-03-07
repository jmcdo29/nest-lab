import { uploadExpressTests } from './file-upload-express/file-upload-express.spec';
import { uploadFastifyTests } from './file-upload-fastify/file-upload-fastify.spec';
import { multipleImportsTest } from './multiple-imports/multiple-imports.spec';
import { uploadWithModuleOptionsTest } from './uploads-from-options/upload-from-options.spec';

(async () => {
  // Run Fastify and Express HTTP tests sequentially to avoid pactum base URL conflicts.
  // Multiple-imports test has no HTTP calls and can run in parallel.
  await Promise.all([uploadFastifyTests, multipleImportsTest]);
  await uploadExpressTests;
  await uploadWithModuleOptionsTest;
})();
