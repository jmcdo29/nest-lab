import { JSONSchemaType } from 'ajv';

import type { CommonInterface } from './common';

import { TypeschemaDto } from '../../src';

const schema: JSONSchemaType<CommonInterface> = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
    bar: { type: 'number' },
  },
  required: ['foo', 'bar'],
  additionalProperties: false,
};

export class AjvDto extends TypeschemaDto(schema) {}
