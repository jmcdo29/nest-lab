# @nest-lab/typeschema

## 0.2.0

### Minor Changes

- 5e274ec: Add a new options parameter to the typeschema validation pipe

  BREAKING CHANGE: the logger is now the **second** parameter of the validation
  pipe with the options being the first. If you use `new ValidationPipe` and pass
  in the logger, you'll need to pass in an empty object or `undefined` as the
  first parameter.

## 0.1.1

### Patch Changes

- 6e0e4b4: Reflect the type of the input schema via generics and an explicit type reference. Types should no longer show up as `unknown`

## 0.1.0

### Minor Changes

- 68104f1: Initial release of @nest-lab/typeschema
