import Joi from 'joi';
import { TypeschemaDto } from '../../src';

const schema = Joi.object({
  foo: Joi.string(),
  bar: Joi.number(),
});

export class JoiDto extends TypeschemaDto(schema) {}
