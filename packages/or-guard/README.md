# @nest-lab/or-guard

This library contains a two guards that allows for checking multiple guards and
creating complex logical statements based on the results of those guards for if
the request should be completed or not.

## Installation

Pick your favorite package manager and install. Should be straight forward.

```sh
npm i @nest-lab/or-guard
yarn add @nest-lab/or-guard
pnpm i @nest-lab/or-guard
```

## OrGuard

To use the `OrGuard`, there are a couple of things that need to happen, due to
how the guard resolves the guards it's going to be using.

First, make sure to add all the guards the `OrGuard` will be using to the
current module's `providers` array. Enhancer in Nest are just specialized
providers after all. This will allow the `OrGuard` to use a `ModuleRef` to get
these guards. The guards can either be registered directly as providers, or set
up as custom providers and you may use an injection token reference. Make sure,
that if you use a custom provider, the _instance_ of the guard is what is tied
to the token, not the reference to the class.

Second, make sure **none** of these guards are `REQUEST` or `TRANSIENT` scoped,
as this **will** make the `OrGuard` throw an error.

Third, make use of it! The `OrGuard` takes in an array of guard to use for the
first parameter, and an optional second parameter for options as described
below.

> **important**: for Nest v7, use `@nest-lab/or-guard@1.0.0`, for Nest v8,
> please use v2

```ts
OrGuard(guards: Array<Type<CanActivate> | InjectionToken>, orGuardOptions?: OrGuardOptions): CanActivate
```

- `guards`: an array of guards or injection tokens for the `OrGuard` to resolve
  and test
- `orGuardOptions`: an optional object with properties to modify how the
  `OrGuard` functions

```ts
interface OrGuardOptions {
  throwOnFirstError?: boolean;
}
```

- `throwOnFirstError`: a boolean to tell the `OrGuard` whether to throw if an
  error is encountered or if the error should be considered a `return false`.
  The default value is `false`. If this is set to `true`, the **first** error
  encountered will lead to the same error being thrown.

> **Note**: guards are ran in a non-deterministic order. All guard returns are
> transformed into Observables and ran concurrently to ensure the fastest
> response time possible.

## AndGuard

Just like the `OrGuard`, you can create a logic grouping of situations that
should pass. This is Nest's default when there are multiple guards passed to the
`@UseGuards()` decorator; however, there are situations where it would be useful
to use an `AndGuard` inside of an `OrGuard` to be able to create logic like
`(A && B) || C`. With using an `AndGuard` inside of an `OrGuard`, you'll most
likely want to create a dedicated [custom provider][customprov] for the guard
like so:

```typescript
{
  provide: AndGuardToken,
  useClass: AndGuard([GuardA, GuardB])
}
```

With this added to the module's providers where you plan to use the related
`OrGuard` you can use the following in a controller or resolve:

```typescript
@UseGuards(OrGuard([AndGuardToken, GuardC]))
```

And this library will set up the handling of the logic for
`(GuardA && GuardB) || GuardC` without having to worry about the complexities
under the hood.

```ts
AndGuard(guards: Array<Type<CanActivate> | InjectionToken>, andGuardOptions?: AndGuardOptions): CanActivate
```

- `guards`: an array of guards or injection tokens for the `AndGuard` to resolve
  and test
- `andGuardOptions`: an optional object with properties to modify how the
  `AndGuard` functions

```ts
interface AndGuardOptions {
  // immediately stop all other guards and throw an error
  throwOnFirstError?: boolean;
  // run the guards in order they are declared in the array rather than in parallel
  sequential?: boolean;
}
```

## Local Development

Feel free to pull down the repository and work locally. If any changes are made,
please make sure tests are added to ensure the functionality works and nothing
is broken.

### Running unit tests

Run `nx test or-guard` to execute the unit tests via [Jest](https://jestjs.io).

[customprov]: https://docs.nestjs.com/fundamentals/custom-providers
