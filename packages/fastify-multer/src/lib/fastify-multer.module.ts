import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import multer from 'fastify-multer';
import { ConfigurableModuleClass } from './fastify-multer.module-definition';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class FastifyMulterModule
  extends ConfigurableModuleClass
  implements OnApplicationBootstrap
{
  constructor(private readonly appHost: HttpAdapterHost<FastifyAdapter>) {
    super();
  }

  onApplicationBootstrap() {
    const fastifyInstance = this.appHost.httpAdapter.getInstance();
    if (!fastifyInstance.hasContentTypeParser('multipart/form-data')) {
      fastifyInstance.register(multer.contentParser);
    }
  }
}
