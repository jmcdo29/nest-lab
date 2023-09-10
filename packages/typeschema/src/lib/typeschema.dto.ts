import { Schema, Infer } from '@decs/typeschema';

export const TypeschemaDto = (schema: Schema) => {
  class TypeschemaDtoMixin {
    static schema = schema;
    static _typeschema = true;
    static OPENAPI_METADATA = {};
    static _OPENAPI_METADATA_FACTORY() {
      return this.OPENAPI_METADATA;
    }
    data: Infer<typeof schema>;

    constructor(parsed: Infer<typeof schema>) {
      this.data = parsed;
    }
  }

  return TypeschemaDtoMixin;
};
