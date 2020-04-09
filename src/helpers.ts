export function omit(object, ...keys: string[]) {
  return keys.reduce(
    (obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        delete obj[key];
      }
      return obj;
    },
    { ...object }
  );
}
