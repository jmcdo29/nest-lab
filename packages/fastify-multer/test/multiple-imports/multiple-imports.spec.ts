import assert = require('node:assert');
import { Test } from '@nestjs/testing';
import test from 'node:test';
import { AppModule } from './app/app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';

export const multipleImportsTest = test('Multiple Import Tests', async (t) => {
  await t.test('Should be true', async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = modRef.createNestApplication(new FastifyAdapter());
    try {
      await app.listen(0);
      assert(app !== undefined);
    } catch {
      assert(false);
    } finally {
      await app.close();
    }
  });
});
