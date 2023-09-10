import { object, number, string } from 'yup';
import { TypeschemaDto } from '../../src';

const schema = object({
  foo: string(),
  bar: number(),
});

export class YupDto extends TypeschemaDto(schema) {}
