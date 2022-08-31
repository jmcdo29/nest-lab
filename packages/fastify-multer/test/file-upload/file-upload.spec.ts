import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { join } from 'node:path';
import { test } from 'node:test';
import { request, spec } from 'pactum';
import { AppModule } from './app/app.module';

export const uploadTests = test('Fastify File Upload', async (t) => {
  const modRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = modRef.createNestApplication(new FastifyAdapter());
  await app.listen(0);
  const url = await app.getUrl();
  request.setBaseUrl(url.replace('[::1]', 'localhost'));
  await t.test('Single File Upload', async () => {
    await spec()
      .post('/single')
      .withFile('file', join(process.cwd(), 'package.json'))
      .expectStatus(201)
      .expectBody({ success: true })
      .toss();
  });
  await t.test('Multiple File Uploads', async () => {
    await spec()
      .post('/multiple')
      .withFile('file', join(process.cwd(), 'package.json'))
      .withFile('file', join(process.cwd(), '.eslintrc.json'))
      .withMultiPartFormData('nonFile', 'Hello World!')
      .expectStatus(201)
      .expectBody({ success: true, fileCount: 2 })
      .toss();
  });
  await t.test('Any File Upload', async () => {
    await spec()
      .post('/any')
      .withFile('fil', join(process.cwd(), 'package.json'))
      .withMultiPartFormData('field', 'value')
      .expectStatus(201)
      .expectBody({ success: true, fileCount: 1 })
      .toss();
  });
  await t.test('File Fields Upload - profile field', async () => {
    await spec()
      .post('/fields')
      .withFile('profile', join(process.cwd(), 'package.json'))
      .expectStatus(201)
      .expectBody({ success: true, fileCount: 1 })
      .toss();
  });
  await t.test('File Fields Upload - avatar field', async () => {
    await spec()
      .post('/fields')
      .withFile('avatar', join(process.cwd(), 'package.json'))
      .expectStatus(201)
      .expectBody({ success: true, fileCount: 1 })
      .toss();
  });
  await t.test('File Fields Upload - profile and avatar fields', async () => {
    await spec()
      .post('/fields')
      .withFile('profile', join(process.cwd(), 'package.json'))
      .withFile('avatar', join(process.cwd(), 'package.json'))
      .expectStatus(201)
      .expectBody({ success: true, fileCount: 2 })
      .toss();
  });
  await t.test('No File Upload - 201, no file', async () => {
    await spec()
      .post('/none')
      .withMultiPartFormData('no', 'files')
      .expectStatus(201)
      .expectBody({ success: true })
      .toss();
  });
  await t.test('No File Upload - 400, with file', async () => {
    await spec()
      .post('/none')
      .withFile('file', join(process.cwd(), 'package.json'))
      .expectStatus(400)
      .toss();
  });
  await app.close();
});
