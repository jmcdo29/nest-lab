import { randomBytes } from 'crypto';
import { createWriteStream, mkdir, unlink } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { Readable } from 'stream';
import type { MulterFile, StorageEngine } from '../interfaces';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export interface DiskStorageOptions {
  destination?:
    | string
    | ((req: any, file: Partial<MulterFile>, callback: DestinationCallback) => void);
  filename?: (req: any, file: Partial<MulterFile>, callback: FilenameCallback) => void;
}

export class DiskStorage implements StorageEngine {
  private readonly getDestination: (
    req: any,
    file: Partial<MulterFile>,
    callback: DestinationCallback,
  ) => void;

  private readonly getFilename: (
    req: any,
    file: Partial<MulterFile>,
    callback: FilenameCallback,
  ) => void;

  constructor(opts: DiskStorageOptions = {}) {
    if (typeof opts.destination === 'function') {
      this.getDestination = opts.destination;
    } else {
      const dest = opts.destination ?? tmpdir();
      this.getDestination = (_req, _file, cb) => cb(null, dest as string);
    }

    if (opts.filename) {
      this.getFilename = opts.filename;
    } else {
      this.getFilename = (_req, _file, cb) => {
        randomBytes(16, (err: Error | null, raw: Buffer) => {
          cb(err, err ? '' : raw.toString('hex'));
        });
      };
    }
  }

  _handleFile(
    req: any,
    file: Pick<MulterFile, 'fieldname' | 'originalname' | 'encoding' | 'mimetype'> & {
      stream: Readable;
    },
    callback: (error: Error | null, info?: Partial<MulterFile>) => void,
  ): void {
    this.getDestination(req, file, (destErr, destination) => {
      if (destErr) return callback(destErr);

      this.getFilename(req, file, (nameErr, filename) => {
        if (nameErr) return callback(nameErr);

        mkdir(destination, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) return callback(mkdirErr);

          const finalPath = join(destination, filename);
          const outStream = createWriteStream(finalPath);

          file.stream.pipe(outStream);
          outStream.on('error', callback);
          outStream.on('finish', () => {
            callback(null, {
              destination,
              filename,
              path: finalPath,
              size: outStream.bytesWritten,
            });
          });
        });
      });
    });
  }

  _removeFile(
    _req: any,
    file: MulterFile,
    callback: (error: Error | null) => void,
  ): void {
    if (!file.path) return callback(null);
    unlink(file.path, callback);
  }
}

export function diskStorage(opts: DiskStorageOptions = {}): StorageEngine {
  return new DiskStorage(opts);
}
