import { INestApplication } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { spec, request } from 'pactum';
import { AppController } from './app.controller';
import { ValidationPipe } from '../src';

const endpoints = [
  { endpoint: 'ajv' },
  { endpoint: 'arktype' },
  { endpoint: 'io-ts' },
  { endpoint: 'joi' },
  { endpoint: 'ow' },
  { endpoint: 'runtypes' },
  { endpoint: 'superstruct' },
  { endpoint: 'typebox' },
  { endpoint: 'valibot' },
  { endpoint: 'yup' },
  { endpoint: 'zod' },
] as const;

describe('TypeschemaPipe integration test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();
    app = modRef.createNestApplication();
    await app.listen(0);
    request.setBaseUrl((await app.getUrl()).replace('[::1]', 'localhost'));
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(endpoints)('call $endpoint - success', async ({ endpoint }) => {
    await spec()
      .post(`/${endpoint}`)
      .withJson({ foo: endpoint, bar: 42 })
      .expectStatus(201)
      .expectBody({ foo: endpoint, bar: 42 })
      .toss();
  });

  it.each(endpoints)('call $endpoint - failure', async ({ endpoint }) => {
    await spec()
      .post(`/${endpoint}`)
      .withJson({ foo: endpoint, bar: true })
      .expectStatus(400)
      .expectJsonLike({
        error: 'Bad Request',
        statusCode: 400,
      })
      .toss();
  });
});
