/**
 * Modified from:
 * @source https://github.com/TomBebb/nestjs-adapter-uws
 */
import * as uws from 'uWebSockets.js';

import { getReasonPhrase } from 'http-status-codes';

import {
  Logger,
  NestApplicationOptions,
  RequestMethod,
  StreamableFile,
} from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';

export const isNil = (val: any): val is null | undefined =>
  isUndefined(val) || val === null;

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === 'object';

import { createWriteStream } from 'fs';

class ServerWrapper {
  address(): string {
    return '0.0.0.0';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/ban-types
  removeListener(name: string, cb: Function) {}
  constructor(public readonly inner: uws.TemplatedApp) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  once() {}
}
import { RequestHandler, VERSION_NEUTRAL } from '@nestjs/common/interfaces';

function setStatus(res: uws.HttpResponse, code: number | string) {
  res.writeStatus(`${code} ${getReasonPhrase(code)}`);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class UwsHttpAdapter extends AbstractHttpAdapter<
  ServerWrapper,
  uws.HttpRequest,
  uws.HttpResponse
> {
  get server(): uws.TemplatedApp {
    return this.httpServer.inner;
  }

  public listen(port: string, callback?: unknown): any {
    const hostname = '0.0.0.0';
    Logger.log(`🚀 Listening at ${hostname}:${port}`, 'uWebSockets.js');
    this.server.listen(
      '0.0.0.0',
      (port as unknown as number) | 0,
      callback as (listenSocket: uws.us_listen_socket | false) => void,
    );
  }

  private injectConstraintsIfVersioned(
    routerMethodKey:
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'options'
      | 'patch'
      | 'head',
    ...args: any[]
  ) {
    const path: string = args[0];
    const handlerRef: RequestHandler = args[args.length - 1];
    this.server.get(path, (res, req) => {
      handlerRef(req, res);
    });
  }
  public async close() {
    Logger.debug('🚧 close is no-op?', 'uWebSockets.js');
  }

  public get(...args: any[]) {
    return this.injectConstraintsIfVersioned('get', ...args);
  }

  public post(...args: any[]) {
    return this.injectConstraintsIfVersioned('post', ...args);
  }

  public head(...args: any[]) {
    return this.injectConstraintsIfVersioned('head', ...args);
  }

  public delete(...args: any[]) {
    return this.injectConstraintsIfVersioned('delete', ...args);
  }

  public put(...args: any[]) {
    return this.injectConstraintsIfVersioned('put', ...args);
  }

  public patch(...args: any[]) {
    return this.injectConstraintsIfVersioned('patch', ...args);
  }

  public options(...args: any[]) {
    return this.injectConstraintsIfVersioned('options', ...args);
  }

  async initHttpServer(options: NestApplicationOptions) {
    this.httpServer = new ServerWrapper(uws.App({}));
  }
  useStaticAssets(aPath: string, options: { prefix?: string }) {
    throw new Error('Method not implemented.');
  }
  setViewEngine(engine: string) {
    throw new Error('Method not implemented.');
  }
  getRequestHostname(request: uws.HttpRequest): string {
    return request.getHeader('Host');
  }
  getRequestMethod(request: uws.HttpRequest): string {
    return request.getMethod();
  }
  getRequestUrl(request: uws.HttpRequest): string {
    return request.getUrl();
  }
  status(response: uws.HttpResponse, statusCode: number) {
    setStatus(response, statusCode);
  }
  reply(
    response: uws.HttpResponse,
    body: any,
    statusCode?: number | undefined,
  ) {
    // console.log('reply', { response, body, statusCode });
    if (statusCode) {
      setStatus(response, statusCode.toString());
    }
    if (isNil(body)) {
      response.end();
    }

    if (body instanceof StreamableFile) {
      const streamHeaders = body.getHeaders();
      if (streamHeaders.type !== undefined) {
        response.writeHeader('Content-Type', streamHeaders.type);
      }
      if (streamHeaders.disposition !== undefined) {
        response.writeHeader('Content-Disposition', streamHeaders.disposition);
      }
      if (streamHeaders.length !== undefined) {
        response.writeHeader('Content-Length', streamHeaders.length.toString());
      }
      //TODO : Implement file sending
    }

    return isObject(body)
      ? response.end(JSON.stringify(body))
      : response.end(String(body));
  }
  render(response: uws.HttpResponse, view: string, options: any) {
    // TODO
    Logger.error(
      '🚧 render Method not implemented: ' + JSON.stringify({ view, options }),
      'uWebSockets.js',
    );
  }
  redirect(response: uws.HttpResponse, statusCode: number, url: string) {
    setStatus(response, 301);
    response.writeHeader('Location', url);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  setErrorHandler(handler: Function, prefix?: string | undefined) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  setNotFoundHandler(handler: Function, prefix?: string | undefined) {}
  setHeader(response: uws.HttpResponse, name: string, value: string) {
    response.writeHeader(name, value);
  }
  registerParserMiddleware(
    prefix?: string | undefined,
    rawBody?: boolean | undefined,
  ) {
    Logger.warn(
      '🚧 registerParserMiddleware Method not implemented: ' +
      JSON.stringify({ prefix, rawBody }),
      'uWebSockets.js',
    );
  }
  enableCors(
    options: CorsOptions | CorsOptionsDelegate<any>,
    prefix?: string | undefined,
  ) {
    Logger.error(
      '🚧 enableCors Method not implemented: ' +
      JSON.stringify({ prefix, options }),
      'uWebSockets.js',
    );
  }
  async createMiddlewareFactory(
    requestMethod: RequestMethod,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<(path: string, callback: Function) => any> {
    Logger.error(
      '🚧 createMiddlewareFactory Method not implemented: ' +
      JSON.stringify({ requestMethod }),
      'uWebSockets.js',
    );

    return;
  }
  getType(): string {
    return 'uWS';
  }
}
