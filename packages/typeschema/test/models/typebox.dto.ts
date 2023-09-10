import { Type } from '@sinclair/typebox';
import { TypeschemaDto } from '../../src';

const schema = Type.Object({
  foo: Type.String(),
  bar: Type.Number(),
});

export class TypeboxDto extends TypeschemaDto(schema) {}
