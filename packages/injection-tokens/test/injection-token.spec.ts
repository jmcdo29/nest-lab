import { Injectable, Module } from '@nestjs/common';
import { InjectionTokenBuilder } from '../src';

interface Foo {
  foo: string;
}

const {
  // rename the values from the return
  type: FooType,
  InjectToken: InjectFoo,
  getToken,
  ...provides
} = new InjectionTokenBuilder<Foo>()
  // able to use a string, symbol, Function, Type<any>, any valid injection token
  .setInjectionToken('foo')
  .build();

@Injectable()
class FooService {
  // type inferred by the `InjectionTokenBuilder`'s generic above
  constructor(@InjectFoo() private readonly injectedFoo: typeof FooType) {}
}

@Module({
  providers: [
    // type safe providers
    provides.provideFactory(() => ({ foo: 'foo' })),
    FooService,
    // untyped manual effort
    { provide: getToken().toString() + 'hello', useValue: 'whatever' },
  ],
})
export class FooModule {}
