import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const multipartRequests = new WeakSet<object>();

@Module({})
export class FastifyCoreModule implements OnApplicationBootstrap {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost<FastifyAdapter>
  ) {}
  onApplicationBootstrap() {
    const fastify = this.httpAdapterHost.httpAdapter.getInstance();
    // Stands in for `multer.contentParser`, which registers the bare `multipart`
    // type that fastify >= 5.7.2 rejects. The body is left for multer to read.
    // As a plugin, it loads after `@fastify/multipart` when NestJS registers
    // that one, so the `isMultipart` check below sees it and does not hide it.
    const contentParser = async (instance: typeof fastify) => {
      if (
        instance.hasContentTypeParser('multipart/form-data') ||
        instance.hasRequestDecorator('isMultipart')
      ) {
        return;
      }
      instance.addContentTypeParser(
        'multipart/form-data',
        (req, _payload, done) => {
          multipartRequests.add(req.raw);
          done(null);
        }
      );
      instance.decorateRequest('isMultipart', function (this: { raw: object }) {
        return multipartRequests.has(this.raw);
      });
    };
    fastify.register(
      Object.assign(contentParser, {
        // Like `fastify-plugin`: register on the root context, not a child one.
        [Symbol.for('skip-override')]: true,
        [Symbol.for('fastify.display-name')]: 'fastify-multer',
        [Symbol.for('plugin-meta')]: { name: 'fastify-multer' },
      })
    );
  }
}
