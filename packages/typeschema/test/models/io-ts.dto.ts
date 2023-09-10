import * as t from 'io-ts';
import { TypeschemaDto } from '../../src';

const schema = t.type({
  foo: t.string,
  bar: t.number,
});

export class IoTsDTO extends TypeschemaDto(schema) {}
