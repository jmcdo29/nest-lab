import { String, Number, Record } from 'runtypes';
import { TypeschemaDto } from '../../src';

const schema = Record({
  foo: String,
  bar: Number,
});

export class RuntypesDto extends TypeschemaDto(schema) {}
