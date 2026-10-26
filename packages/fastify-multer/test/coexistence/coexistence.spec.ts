import fastifyMultipart from '@fastify/multipart';
import { INestApplication, Type } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { FastifyInstance } from 'fastify';
import { join } from 'node:path';
import { test } from 'node:test';
import { request, spec } from 'pactum';
import { AppModule, MulterAppModule } from './app/app.module';

const startApp = async (
  module: Type<unknown>,
  setUp: (instance: FastifyInstance) => void,
  run: () => Promise<unknown>
) => {
  const modRef = await Test.createTestingModule({
    imports: [module],
  }).compile();
  const adapter = new FastifyAdapter();
  setUp(adapter.getInstance<FastifyInstance>());
  const app: INestApplication = modRef.createNestApplication(adapter);
  try {
    await app.listen(0);
    const url = await app.getUrl();
    request.setBaseUrl(url.replace('[::1]', 'localhost'));
    await run();
  } finally {
    await app.close();
  }
};

const upload = (path: string) =>
  spec()
    .post(path)
    .withFile('file', join(process.cwd(), 'package.json'))
    .expectStatus(201)
    .expectBody({ success: true })
    .toss();

export const coexistenceTests =
  test('Fastify Multer with other multipart plugins', async (t) => {
    await t.test('Nest multipart interceptors in the same app', async () => {
      await startApp(
        AppModule,
        () => undefined,
        async () => {
          await upload('/multer');
          await upload('/nest');
        }
      );
    });
    await t.test('@fastify/multipart registered in main.ts', async () => {
      await startApp(
        AppModule,
        (instance) => {
          instance.register(fastifyMultipart);
        },
        async () => {
          await upload('/multer');
          await upload('/nest');
        }
      );
    });
    await t.test('isMultipart decorated before init', async () => {
      await startApp(
        MulterAppModule,
        (instance) => {
          instance.addContentTypeParser(
            /^multipart\//,
            (_req, _payload, done) => done(null)
          );
          instance.decorateRequest('isMultipart', () => true);
        },
        () => upload('/multer')
      );
    });
  });
