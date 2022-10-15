import { Module } from '@nestjs/common';
import { FastifyCoreModule } from './fastify-multer-core.module';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './fastify-multer.module-definition';

@Module({
  imports: [FastifyCoreModule],
  controllers: [],
  providers: [],
  exports: [MODULE_OPTIONS_TOKEN],
})
export class FastifyMulterModule extends ConfigurableModuleClass {}
