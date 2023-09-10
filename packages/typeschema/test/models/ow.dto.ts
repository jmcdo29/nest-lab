import ow from 'ow';
import { TypeschemaDto } from '../../src';

const schema = ow.object.exactShape({
  foo: ow.string,
  bar: ow.number,
});

export class OwDto extends TypeschemaDto(schema) {}
