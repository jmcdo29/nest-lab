import type { Readable } from 'stream';
import type { MulterFile, StorageEngine } from '../interfaces';

export class MemoryStorage implements StorageEngine {
  _handleFile(
    _req: any,
    file: Pick<MulterFile, 'fieldname' | 'originalname' | 'encoding' | 'mimetype'> & {
      stream: Readable;
    },
    callback: (error: Error | null, info?: Partial<MulterFile>) => void,
  ): void {
    const chunks: Buffer[] = [];
    file.stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    file.stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      callback(null, { buffer, size: buffer.length });
    });
    file.stream.on('error', callback);
  }

  _removeFile(
    _req: any,
    file: MulterFile,
    callback: (error: Error | null) => void,
  ): void {
    delete file.buffer;
    callback(null);
  }
}

export function memoryStorage(): StorageEngine {
  return new MemoryStorage();
}
