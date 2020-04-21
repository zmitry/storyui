export type JsonField = {
  name: string;
  isType: (value: any, key: string, path: any, rootValue: any) => boolean;
  component?: React.ElementType;
  props: React.ComponentPropsWithRef<any>;
  defaultValue?: (value: any, type: string, groupType: string) => any;
};
export type Components = Array<JsonField>;
