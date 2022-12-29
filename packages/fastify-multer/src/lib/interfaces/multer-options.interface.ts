import {FastifyRequest} from "fastify";
import {StorageEngine, File} from "fastify-multer/lib/interfaces";


/**
 * @see https://github.com/expressjs/multer
 */
export interface MulterOptions {
  dest?: string;
  /** The storage engine to use for uploaded files. */
  storage?: StorageEngine
  /**
   * An object specifying the size limits of the following optional properties. This object is passed to busboy
   * directly, and the details of properties can be found on https://github.com/mscdex/busboy#busboy-methods
   */
  limits?: {
    /** Max field name size (Default: 100 bytes) */
    fieldNameSize?: number;
    /** Max field value size (Default: 1MB) */
    fieldSize?: number;
    /** Max number of non- file fields (Default: Infinity) */
    fields?: number;
    /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
    fileSize?: number;
    /** For multipart forms, the max number of file fields (Default: Infinity) */
    files?: number;
    /** For multipart forms, the max number of parts (fields + files)(Default: Infinity) */
    parts?: number;
    /** For multipart forms, the max number of header key=> value pairs to parse Default: 2000(same as node's http). */
    headerPairs?: number;
  };

  /** Keep the full path of files instead of just the base name (Default: false) */
  preservePath?: boolean;

  fileFilter?(
    req: FastifyRequest,
    file: File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void;
}

export interface MulterField {
  /** The field name. */
  name: string;
  /** Optional maximum number of files per field to accept. */
  maxCount?: number;
}
