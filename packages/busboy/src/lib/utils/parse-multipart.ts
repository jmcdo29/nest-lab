import { Busboy, type BusboyHeaders } from '@fastify/busboy';
import type { Readable } from 'stream';
import type { BusboyOptions, MulterFile, StorageEngine } from '../interfaces';
import { diskStorage } from '../storage/disk.storage';
import { memoryStorage } from '../storage/memory.storage';
import { busboyExceptions } from './busboy.constants';

export type ParseMode = 'single' | 'array' | 'fields' | 'any' | 'none';

export interface ParseConstraints {
  fieldName?: string;
  maxCount?: number;
  uploadFields?: Array<{ name: string; maxCount?: number }>;
}

export function getStream(req: any): Readable {
  // Fastify: our content-type parser stores the raw payload as req.body
  if (req.body != null && typeof (req.body as any).pipe === 'function') {
    return req.body as Readable;
  }
  // Express: req IS the IncomingMessage stream
  // Fastify (no parser registered): req.raw is the IncomingMessage
  return (req as any).raw ?? req;
}

export function resolveStorage(options: BusboyOptions): StorageEngine {
  if (options.storage) return options.storage;
  if (options.dest) return diskStorage({ destination: options.dest });
  return memoryStorage();
}

export function parseMultipart(
  req: any,
  options: BusboyOptions,
  mode: ParseMode,
  constraints: ParseConstraints = {},
): Promise<{ files: MulterFile[]; body: Record<string, string | string[]> }> {
  return new Promise((resolve, reject) => {
    const stream = getStream(req);
    const headers = req.headers as BusboyHeaders;
    const storage = resolveStorage(options);

    const bb = new Busboy({
      headers,
      limits: options.limits,
      preservePath: options.preservePath,
    });

    const files: MulterFile[] = [];
    const body: Record<string, string | string[]> = {};
    const pending: Promise<void>[] = [];
    let firstError: Error | null = null;

    // @fastify/busboy file event: (fieldname, stream, filename, encoding, mimeType)
    bb.on('file', (fieldname: string, fileStream: Readable, originalname: string, encoding: string, mimetype: string) => {
      // none mode: reject any file
      if (mode === 'none') {
        fileStream.resume();
        firstError ??= new Error(busboyExceptions.LIMIT_UNEXPECTED_FILE);
        return;
      }

      // single/array mode: only accept the specified field
      if (
        (mode === 'single' || mode === 'array') &&
        constraints.fieldName != null &&
        fieldname !== constraints.fieldName
      ) {
        fileStream.resume();
        firstError ??= new Error(busboyExceptions.LIMIT_UNEXPECTED_FILE);
        return;
      }

      // array mode: check maxCount
      if (mode === 'array' && constraints.maxCount != null) {
        const existing = files.filter((f) => f.fieldname === fieldname).length;
        if (existing >= constraints.maxCount) {
          fileStream.resume();
          firstError ??= new Error(busboyExceptions.LIMIT_FILE_COUNT);
          return;
        }
      }

      // fields mode: validate against uploadFields list
      if (mode === 'fields' && constraints.uploadFields) {
        const fieldDef = constraints.uploadFields.find((f) => f.name === fieldname);
        if (!fieldDef) {
          fileStream.resume();
          firstError ??= new Error(busboyExceptions.LIMIT_UNEXPECTED_FILE);
          return;
        }
        if (fieldDef.maxCount != null) {
          const existing = files.filter((f) => f.fieldname === fieldname).length;
          if (existing >= fieldDef.maxCount) {
            fileStream.resume();
            firstError ??= new Error(busboyExceptions.LIMIT_FILE_COUNT);
            return;
          }
        }
      }

      const fileInfo = { fieldname, originalname, encoding, mimetype };

      const processFile = async (): Promise<void> => {
        // Apply file filter
        if (options.fileFilter) {
          const accepted = await new Promise<boolean>((res, rej) => {
            options.fileFilter!(req, fileInfo as any, (err, accept) => {
              if (err) rej(err);
              else res(accept);
            });
          });
          if (!accepted) {
            fileStream.resume();
            return;
          }
        }

        const storedInfo = await new Promise<Partial<MulterFile>>((res, rej) => {
          storage._handleFile(req, { ...fileInfo, stream: fileStream }, (err, info) => {
            if (err) rej(err);
            else res(info ?? {});
          });
        });

        // Check if file was truncated due to fileSize limit
        if ((fileStream as any).truncated) {
          firstError ??= new Error(busboyExceptions.LIMIT_FILE_SIZE);
          return;
        }

        files.push({ ...fileInfo, size: storedInfo.size ?? 0, ...storedInfo } as MulterFile);
      };

      pending.push(processFile());
    });

    bb.on('field', (fieldname: string, value: string) => {
      if (Object.prototype.hasOwnProperty.call(body, fieldname)) {
        const existing = body[fieldname];
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          body[fieldname] = [existing as string, value];
        }
      } else {
        body[fieldname] = value;
      }
    });

    bb.on('filesLimit', () => {
      firstError ??= new Error(busboyExceptions.LIMIT_FILE_COUNT);
    });

    bb.on('fieldsLimit', () => {
      firstError ??= new Error(busboyExceptions.LIMIT_FIELD_COUNT);
    });

    bb.on('partsLimit', () => {
      firstError ??= new Error(busboyExceptions.LIMIT_PART_COUNT);
    });

    bb.on('error', (err: Error) => {
      reject(err);
    });

    bb.on('finish', () => {
      Promise.all(pending).then(
        () => {
          if (firstError) {
            reject(firstError);
          } else {
            resolve({ files, body });
          }
        },
        (err) => reject(err),
      );
    });

    stream.pipe(bb);
  });
}
