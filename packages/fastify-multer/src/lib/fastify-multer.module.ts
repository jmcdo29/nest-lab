import { Module } from '@nestjs/common';
import { FastifyCoreModule } from './fastify-multer-core.module';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './fastify-multer.module-definition';

@Module({
  imports: [FastifyCoreModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FastifyMulterModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE) {
    return {
      ...super.register(options),
      exports: [MODULE_OPTIONS_TOKEN],
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE) {
    return {
      ...super.registerAsync(options),
      exports: [MODULE_OPTIONS_TOKEN],
    };
  }
}
