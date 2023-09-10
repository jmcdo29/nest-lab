import { Schema, Infer } from '@decs/typeschema';

export const TypeschemaDto = <TSchema extends Schema>(
  schema: TSchema
): {
  new (parsed: Infer<TSchema>): {
    data: Infer<TSchema>;
  };
  schema: TSchema;
  OPENAPI_METADATA: Record<string, unknown>;
} => {
  class TypeschemaDtoMixin<S extends Schema> {
    static schema = schema;
    static _typeschema = true;
    static OPENAPI_METADATA = {};
    static _OPENAPI_METADATA_FACTORY() {
      return this.OPENAPI_METADATA;
    }
    data: Infer<S>;

    constructor(parsed: Infer<S>) {
      this.data = parsed;
    }
  }

  return TypeschemaDtoMixin<TSchema>;
};
