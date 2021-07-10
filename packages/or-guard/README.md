# or-guard

This library contains a single guard that allows for checking multiple guards and if **any one of them passes** the entire request will be considered authenticated.

## Installation

Pick your favorite package manager and install. Should be straight forward.

```sh
npm i @nest-lab/or-guard
yarn add @nest-lab/or-guard
pnpm i @nest-lab/or-guard
```

## Usage

To use the `OrGuard`, there are a couple of things that need to happen, due to how the guard resolves the guards it's going to be using.

First, make sure to add all the guards the `OrGuard` will be using to the current module's `providers` array. Enhancer in Nest are just specialized providers after all. This will allow the `OrGuard` to use a `ModuleRef` to get these guards.

Second, make sure **none** of these guards are `REQUEST` or `TRANSIENT` scoped, as this **will** make the `OrGuard` throw an error.

Third, make use of it! The `OrGuard` takes in an array of guard to use for the first parameter, and an optional second parameter for options as described below.

> **important**: for Nest v7, use `@nest-lab/or-guard@1.0.0`, for Nest v8, please use v2

```ts
OrGuard(guards: CanActivate[], orGuardOptions?: OrGuardOptions): CanActivate
```

- `guards`: an array of guards for the `OrGuard` to resolve and test
- `orGuardOptions`: an optional object with properties to modify how the `OrGuard` functions

```ts
interface OrGuardOptions {
  throwOnFirstError?: boolean;
}
```

- `throwOnFirstError`: a boolean to tell the `OrGuard` whether to throw if an error is encountered or if the error should be considered a `return false`. The default value is `false`. If this is set to `true`, the **first** error encountered will lead to the same error being thrown.

> **Note**: guards are ran in a non-deterministic order. All guard returns are transformed into Observables and ran concurrently to ensure the fastest response time possible.

## Local Development

Feel free to pull down the repository and work locally. If any changes are made, please make sure tests are added to ensure the functionality works and nothing is broken.

### Running unit tests

Run `nx test or-guard` to execute the unit tests via [Jest](https://jestjs.io).
