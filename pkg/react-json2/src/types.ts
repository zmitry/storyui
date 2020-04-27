export type JsonField = {
  name: string;
  isType?: (value: any, key: string, path: any, rootValue: any) => boolean;
  component?: React.ElementType;
  props?: React.ComponentPropsWithRef<any>;
  defaultValue?: (value: any, type: string, groupType: string) => any;
  parse?: any;
  format?: any;
  hidden?: false;
};

export type JsonField2 = {
  // name: string;
  // isType: (value: any, key: string, path: any, rootValue: any) => boolean;
  component?: React.ElementType;
  props?: React.ComponentPropsWithRef<any>;
  parse?: any;
  format?: any;
};

export type Components = Array<JsonField>;

/**
 * 1. typed list
 * 2. typed map
 * 3. prop
 * 4. untyped prop
 */
export type SchemaElement = SchemaObject | SchemaType;

export type SchemaType = {
  type: string;
};

export type SchemaObject = {
  type: string | "list" | "map";
  fields: Record<string, SchemaElement> | SchemaElement;
};

export type ParsedSchemaType = {
  type: string;
  defaultValue?: () => any;
};
export type ParsedSchemaElement = ParsedSchemaObject | ParsedSchemaType;
export type ParsedSchemaObject = {
  type: string | "list" | "map" | "record";
  fields: Record<string, ParsedSchemaElement>;
  defaultValue?: () => any;
};
