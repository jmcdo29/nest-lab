# ⚡ @nest-lab/platform-uws
> `HttpAdapter` and `IoAdapter` for [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) (aka UWS)


## ℹ️ Overview

Replaces the `httpServer` with `UWS`. Overrides `IoAdapter` in [@nextjs/platform-socket.io](https://www.npmjs.com/package/@nestjs/platform-socket.io).

### 🤔 Reasoning
 - `UWS` has a much [lower memory footprint](https://socket.io/docs/v4/memory-usage/)
 - **socket.io** reintroduced `UWS` in [v4](https://socket.io/docs/v4/server-installation/#usage-with-uwebsockets) (it's back again!)
 - Performance is allegedly ["8x that of fastify and at least 10x that of socket.io"](https://github.com/uNetworking/uWebSockets.js#zap-simple-performance)

## 📦 Installation

#### npm
```shell
npm i @nest-lab/platform-uws
```
#### yarn
```shell
yarn add @nest-lab/platform-uws
```
#### pnpm
```shell
pnpm i @nest-lab/platform-uws
```

## ⚙️ Usage

```typescript
// ./src/main.ts
import { NestFactory } from '@nestjs/core';
import { UwsHttpAdapter, UwsIoAdapter } from '@nest-lab/platform-uws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new UwsHttpAdapter());
  const ioAdapter = new UwsIoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);
  await app.listen(3000);
}
bootstrap();
```
## 🥅 Project Goals

- [x] Provide basic `HTTPAdapter` backed by `UWS`
- [x] Provide `WebSocketAdapter` backed by `UWS`
- [ ] Provide Advanced `HTTPAdapter` features
- [ ] Test Specifications
- [ ] Test performance vs Express, Fastify and Socket.io


# 👥 Credit
 - [@jmcdo29]() @nest-lab scope maintainer
 - [@TomBebb]() Original author of [UwsHttpAdapter](https://github.com/TomBebb/nestjs-adapter-uws)
 - [@PhearZero]() Experimenting with [UWS](https://github.com/PhearZero/nest-uws)


## 🔊 Rant

`uWebSockets.js` has been around for a while, and it's relationship with `socket.io` has been tenuous at best.
With the advent of the `Zig` language and subsequently the `Bun.js` interpreter, `uWebSockets` has become popular
again. This is even more true in the `Cryptocurrency` space with several large exchanges building exclusively on `UWS`.
