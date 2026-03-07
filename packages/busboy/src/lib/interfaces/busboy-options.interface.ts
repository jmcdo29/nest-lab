import type { Readable } from 'stream';

export interface MulterFile {
  /** The field name as specified in the HTML form. */
  fieldname: string;
  /** The name of the uploaded file. */
  originalname: string;
  /** Encoding type of the file. */
  encoding: string;
  /** Mime type of the file. */
  mimetype: string;
  /** Size of the file in bytes. */
  size: number;
  /** The folder to which the file has been saved (DiskStorage). */
  destination?: string;
  /** The name of the file within the destination (DiskStorage). */
  filename?: string;
  /** The full path to the uploaded file (DiskStorage). */
  path?: string;
  /** A Buffer of the entire file (MemoryStorage). */
  buffer?: Buffer;
  /** The readable stream of the file. */
  stream?: Readable;
}

export interface StorageEngine {
  _handleFile(
    req: any,
    file: Pick<MulterFile, 'fieldname' | 'originalname' | 'encoding' | 'mimetype'> & {
      stream: Readable;
    },
    callback: (error: Error | null, info?: Partial<MulterFile>) => void,
  ): void;
  _removeFile(
    req: any,
    file: MulterFile,
    callback: (error: Error | null) => void,
  ): void;
}

export type FileFilter = (
  req: any,
  file: Pick<MulterFile, 'fieldname' | 'originalname' | 'encoding' | 'mimetype'>,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => void;

export interface MulterField {
  /** The field name. */
  name: string;
  /** Optional maximum number of files per field to accept. */
  maxCount?: number;
}

export interface BusboyLimits {
  /** Max field name size (in bytes). Default: 100 bytes. */
  fieldNameSize?: number;
  /** Max field value size (in bytes). Default: 1MB. */
  fieldSize?: number;
  /** Max number of non-file fields. Default: Infinity. */
  fields?: number;
  /** Max file size (in bytes). Default: Infinity. */
  fileSize?: number;
  /** Max number of file fields. Default: Infinity. */
  files?: number;
  /** Max number of parts (fields + files). Default: Infinity. */
  parts?: number;
  /** Max number of header key-value pairs. Default: 2000. */
  headerPairs?: number;
}

export interface BusboyOptions {
  /** The storage engine to use for uploaded files. Defaults to MemoryStorage. */
  storage?: StorageEngine;
  /** The destination directory for uploaded files. If set, uses DiskStorage. */
  dest?: string;
  /** Function to control which files are accepted. */
  fileFilter?: FileFilter;
  /** Limits on the incoming data. */
  limits?: BusboyLimits;
  /** Whether to preserve the full path of the original filename. */
  preservePath?: boolean;
}
