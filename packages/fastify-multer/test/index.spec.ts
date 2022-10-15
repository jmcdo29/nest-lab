import { uploadTests } from './file-upload/file-upload.spec';
import { multipleImportsTest } from './multiple-imports/multiple-imports.spec';
import { uploadWithModuleOptionsTest } from './uploads-from-options/upload-from-options.spec';

(async () => {
  await Promise.all([
    uploadTests,
    multipleImportsTest,
    uploadWithModuleOptionsTest,
  ]);
})();
