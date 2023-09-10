import { string, number, object } from 'superstruct';
import { TypeschemaDto } from '../../src';

const schema = object({
  foo: string(),
  bar: number(),
});

export class SuperstructDto extends TypeschemaDto(schema) {}
