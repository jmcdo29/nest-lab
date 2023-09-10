import { z } from 'zod';
import { TypeschemaDto } from '../../src';

const schema = z.object({
  foo: z.string(),
  bar: z.number(),
});

export class ZodDto extends TypeschemaDto(schema) {}
