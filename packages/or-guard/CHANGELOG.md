# @nest-lab/or-guard

## 2.6.0

### Minor Changes

- 45c426c: Now supporting NestJS v11

## 2.5.0

### Minor Changes

- 458f98f: Allow for the `OrGuard` to handle throwing the last error or a custom
  error when it fails to pass one of the guards.

## 2.4.1

### Patch Changes

- 7972281: Use `{strict: false}` when calling modRef.get() to ensure guards can
  come from other modules

## 2.4.0

### Minor Changes

- 3a767b5: Allow for AndGuard guards to be ran in sequential order

## 2.3.0

### Minor Changes

- bc9bbdf: Add a new AndGuard to handle complex logical cases

  With the new `AndGuard` it is now possible to create logical cases like
  `(A && B) || C` using the `OrGuard` and a composite guard approach. Check out
  the docs for more info

## 2.2.0

### Minor Changes

- cb1b1ee: Update peer deps to support Nest v10. No code changes

## 2.1.0

### Minor Changes

- 4f15fe7: Support Nest v9

## 2.0.0

### Major Changes

- a098b52: Update Nest to v8 and RxJS to v7

## 1.0.0

### Major Changes

- 3bb10ce: Publish the OrGuard
