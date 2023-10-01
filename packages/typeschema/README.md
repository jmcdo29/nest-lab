# @nest-lab/typeschema

[Typeschema][typeschema] is a general purpose validator that integrates with
_several_ other validation packages. This library brings that integration into
[NestJS][nest] as well! Just as Nest by default can integrate with
class-validator, this package provides a `ValidationPipe` to bring a similar
experience to `@decs/typeschema`.

## Crafting DTOs

As all of these validation libraries typeschema integrates with use schemas
instead of classes, we need to do a little work creating the DTO classes for
Typescript's metadata reflection to enable us to have the same experience that
already exists. Fortunately, this is pretty straightforward with how typeschema
works! Simple extend the `TypeschemaDto` mixin by passing it your proper schema
and viola! the DTO has been made.

```typescript
import { TypeschemaDto } from '@nest-lab/typeschema';
import { z } from 'zod';

const helloWorldSchema = z.object({
  message: z.string(),
});

export class HelloWorldDto extends TypeschemaDto(helloWorldSchema) {}
```

What this does under the hood is creates a class that has a `static schema`
property, along with a few others, that are then used by the
`ValidationPipe` so that the incoming data can be properly validated.

## Consuming the Data from the ValidationPipe

Something to make sure to take note of, this `ValidationPipe` **does not**
return the exact same data as was passed in. In other words, unlike Nest's
default `ValidationPipe`, this one does change the structure of the data after
it has been parsed. It does this to provide a sane, type safe API. For
**every** `TypeschemaDto` class, to access the data after it has been validated
by the pipe, simply access the `.data` property.

```typescript
@Controller()
export class AppController {
  @Post('ajv')
  ajvTest(@Body() body: AjvDto) {
    return body.data;
  }
}
```

## Binding the ValidationPipe

Just like the existing validation pipe, you can bind this pipe using
`APP_PIPE` or `app.useGlobalPipes(new ValidationPipe())` for globally binding
it, or simple `@UsePipes(ValidationPipe)` to bind it to a controller or method,
or `@Body(ValidationPipe)` to bind it to a single parameter.

## Options for the pipe

Currently the only option is an `exceptionFactory` that takes in an array of
`ValidationIssue` from the `@decs/typeschema` package and returns an `Error` to
be thrown. By default, this array is passed directly to `BadRequestException`
from `@nestjs/common`.

If you want to pass the options you can via `new ValidationPipe`, or if you
prefer to let Nest inject the options you can add them via the `TypeschemaOptions`
injection token using a custom provider.

## Integration with OpenAPI

I know this is going to be a big question, and eventually I want to have the
integration automatically there. However, right now, because of the underlying
libraries, there's no immediate introspection of each library, which means that
we can't, in a type safe manner, create the OpenAPI spec for each DTO.

However, all is not lost, as it _can_ still integrate with `@nestjs/swagger` so
long as you add a `static OPENAPI_METADATA` property to the DTO. For the format
of this, please check [`@nestjs/swagger`'s integration tests][swaggertests].

[typeschema]: https://typeschema.com/
[nest]: https://docs.nestjs.com/
[swaggertests]: https://github.com/nestjs/swagger/tree/master/test/plugin/fixtures
