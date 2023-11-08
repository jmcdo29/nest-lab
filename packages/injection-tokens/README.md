# @nest-lab/injection-token

This is an attempt at making a more type-safe injection token with NestJS While
keeping the use of decorators and not needing to modify the internals of Nest.

## Installation

Pretty standard

```sh
$ pnpm install @nest-lab/injection-token
$ yarn add @nest-lab/injection-token
$ npm install @nest-lab/injection-token
```

Really, nothing special here.

## The InjectionTokenBuilder

To create the injection token, and helpers around it, we need to use the
`InjectionTokenBuilder` class that is exposed from the library. For the token's
type, we can pass an interface, class, primitive, or type to the generic and
let Typescript's type system do the rest. Then we can set the token using the
builder's API and build the final object with the injection token's decorator,
the actual token, and a few type-safe helpers.

```ts
interface Foo {
  foo: string;
}

const {
  type: FooType,
  InjectToken: InjectFoo,
  getToken,
  ...provides
} = new InjectionTokenBuilder<Foo>().setInjectionToken('foo').build();
```

Above, we destructure the returned object to make it a bit easier to work.
Breaking down everything returned we have the following:

- `type`: **DO NOT USE THIS IT IS UNDEFINED** this "property" is only here for
  type safe goodness. It has the type `T` passed to the generic of the
  `InjectionTokenBuilder`, but it **DOES NOT** have a value. This is intentional
- `InjectToken`: this is the decorator that consumers will use to inject the
  provider tied to this created token. It's essentially a wrapper around
  `@Inject(createdToken)`, but already done so you don't have to worry about it
- `getToken`: this is a helper method to get the token. Useful in tests, or if
  you want to expose a way for devs to provide a value for the token in a
  non-type-safe way
- `provideFactory`: a way for devs to provide values for the `useFactory` and
  `inject` properties of a factory provider for the token. The `provide` is
  already taken care of
- `provideClass`: like `provideFactory`, but with `useClass` instead.
- `provideValue`: and again, like `provideFactory`, but with `useValue`

> the `provide*` are hidden in the `...provides` in the above, but they are
> there nonetheless

## Using the provides

Now that the token has its `provide*` methods exposed, we can make use of them
in a `@Module()` like so

```ts
@Module({
  providers: [FooService, provideValue({ foo: 'foo' })],
})
export class FooModule {}
```

In the above, if we try to pass `{ bar: 'something else' }`, Typescript will
properly complain that the value `{ bar: string }` does not satisfy the
interface of `Foo`.

For a factory, we can do something like

```ts
@Module({
  providers: [
    FooService,
    provideFactory(
      (config: ConfigService) => ({ foo: config.get('FOO') }),
      [ConfigService]
    ),
  ],
})
export class FooModule {}
```

## Using the InjectToken

We'll make use of the `InjectFoo` we renamed above. Now that we have our provider in the
`providers` array using one of the `provide*` methods, we can now move into the
`FooService` and inject it.

```ts
@Injectable()
export class FooService {
  constructor(@InjectFoo() private readonly foo: typeof FooType) {}

  getFoo() {
    return this.foo.foo; // typescript infers this to be a 'string'
  }
}
```

Because of the `Foo` interface initially passed to the `InjectionTokenBuilder`,
and the destructured `type` to `FooType`, we can get the type of `FooType` by
using Typescript's `typeof` operator and know that `this.foo` is really of type
`{ foo: string }`. Also, with `@InjectFoo()` we are essentially calling
`@Inject(getToken())`, meaning that we no longer need to worry about remembering
to add the actual token to inject, the library has it added for us.

## Wrapping up

So just like that, we now have a type-_safer_ way to create injection tokens.
Unfortunately, there's no way to restrict this further ad parameter and
property decorators cannot modify the types of what they're acting on, but
the aim of the library is to help making providers creating in a more type-safe
manner, and to help the injections be cleaner with less guesswork about their
types.
