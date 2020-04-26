export type JsonField = {
  name: string;
  isType: (value: any, key: string, path: any, rootValue: any) => boolean;
  component?: React.ElementType;
  props: React.ComponentPropsWithRef<any>;
  defaultValue?: (value: any, type: string, groupType: string) => any;
  parse?: any;
  format?: any;
  hidden?: false;
};

const schema = {
  size: {
    kek: {
      name: { type: "string", defaultValue: () => "hello" },
    },
    items: {
      type: "list",
      fields: {
        name: { type: "string" },
        user: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
    },
    name: {
      type: "string",
      validate(v) {
        return !v && "is required";
      },
    },
  },
};

export type JsonField2 = {
  // name: string;
  // isType: (value: any, key: string, path: any, rootValue: any) => boolean;
  component?: React.ElementType;
  props: React.ComponentPropsWithRef<any>;
  parse?: any;
  format?: any;
};

const convertValue = (newType, prevValue, prevType) => {};
const isType = () => {};
type compo = {
  asf: {
    path: "users";
    control: React.ElementType;
    hidden?: false;
    props: React.ComponentPropsWithRef<any>;
    parse?: any;
    format?: any;
  };
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
