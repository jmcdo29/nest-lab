import { type } from 'arktype';
import { TypeschemaDto } from '../../src';

const schema = type({
  foo: 'string',
  bar: 'number',
});

export class ArktypeDto extends TypeschemaDto(schema) {}
