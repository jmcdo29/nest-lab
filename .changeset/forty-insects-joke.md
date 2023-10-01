---
'@nest-lab/typeschema': minor
---

Add a new options parameter to the typeschema validation pipe

BREAKING CHANGE: the logger is now the **second** parameter of the validation
pipe with the options being the first. If you use `new ValidationPipe` and pass
in the logger, you'll need to pass in an empty object or `undefined` as the
first parameter.
