import { Module } from '@nestjs/common';
import { FastifyCoreModule } from './fastify-multer-core.module';
import { ConfigurableModuleClass } from './fastify-multer.module-definition';

@Module({
  imports: [FastifyCoreModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FastifyMulterModule extends ConfigurableModuleClass {}
