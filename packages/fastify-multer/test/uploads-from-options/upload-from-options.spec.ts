import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { unlink } from 'fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import { request, spec } from 'pactum';
import { AppModule } from './app/app.module';

export const uploadWithModuleOptionsTest =
  test('Fastify File Upload with Module Options', async (t) => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = modRef.createNestApplication(new FastifyAdapter());
    await app.listen(0);
    const url = await app.getUrl();
    request.setBaseUrl(url.replace('[::1]', 'localhost'));
    let filePath = '';
    await t.test('It should upload the file to the disk', async () => {
      await spec()
        .post('/')
        .withFile('file', join(process.cwd(), 'package.json'))
        .expectStatus(201)
        .returns(({ res }) => {
          filePath = (res.json as any).filename;
        })
        .toss();
    });
    await unlink(join(process.cwd(), 'uploads', filePath));
    await app.close();
  });
