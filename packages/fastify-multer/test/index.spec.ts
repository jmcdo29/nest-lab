import { uploadTests } from './file-upload/file-upload.spec';
import { multipleImportsTest } from './multiple-imports/multiple-imports.spec';

(async () => {
  await Promise.all([uploadTests, multipleImportsTest]);
})();
