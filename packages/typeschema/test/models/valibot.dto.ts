import { object, string, number } from 'valibot';
import { TypeschemaDto } from '../../src';

const schema = object({
  foo: string(),
  bar: number(),
});

export class ValibotDto extends TypeschemaDto(schema) {}
