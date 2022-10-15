import { Module } from '@nestjs/common';
import { FastifyCoreModule } from './fastify-multer-core.module';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './fastify-multer.module-definition';
import { MULTER_OPTIONS } from './files.constants';
import { MulterModuleOptions } from './interfaces';

@Module({
  imports: [FastifyCoreModule],
  controllers: [],
  providers: [
    {
      provide: MULTER_OPTIONS,
      useFactory: (options?: MulterModuleOptions) => ({ ...(options ?? {}) }),
      inject: [{ token: MODULE_OPTIONS_TOKEN, optional: true }],
    },
  ],
  exports: [MULTER_OPTIONS],
})
export class FastifyMulterModule extends ConfigurableModuleClass {}
