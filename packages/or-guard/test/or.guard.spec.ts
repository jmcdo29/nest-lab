import { INestApplication } from '@nestjs/common';
import { TestingModuleBuilder, Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { of } from 'rxjs';

import { AppModule } from './app.module';
import { ObsGuard } from './obs.guard';
import { PromGuard } from './prom.guard';
import { SyncGuard } from './sync.guard';

describe('Or Guard Integration Test', () => {
  let moduleConfig: TestingModuleBuilder;

  beforeEach(() => {
    moduleConfig = Test.createTestingModule({
      imports: [AppModule],
    });
  });

  describe.each`
    sync     | syncExpect
    ${true}  | ${true}
    ${false} | ${false}
  `('sync val $sync syncExpect $syncExpect', ({ sync, syncExpect }) => {
    describe.each`
      prom     | promExpect
      ${true}  | ${true}
      ${false} | ${syncExpect ?? false}
    `('prom val $prom promExpect $promExpect', ({ prom, promExpect }) => {
      describe.each`
        obs      | obsExpect
        ${true}  | ${true}
        ${false} | ${promExpect ?? false}
      `('obs val $obs final expect $obsExpect', ({ obs, obsExpect }) => {
        let app: INestApplication;
        beforeEach(async () => {
          const testMod = await moduleConfig
            .overrideProvider(SyncGuard)
            .useValue({ canActivate: () => sync })
            .overrideProvider(PromGuard)
            .useValue({ canActivate: async () => prom })
            .overrideProvider(ObsGuard)
            .useValue({ canActivate: () => of(obs) })
            .compile();
          app = testMod.createNestApplication();
          await app.init();
        });
        it(`should make a request to the server and succeed: ${obsExpect}`, async () => {
          return supertest(app.getHttpServer())
            .get('/')
            .expect(obsExpect ? 200 : 403);
        });
      });
    });
  });
});
