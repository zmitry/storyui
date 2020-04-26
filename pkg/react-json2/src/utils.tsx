export function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as any);
}

export function isObjectLike(d, leftParen, rightParen) {
  return d.trim().startsWith(leftParen) && d.trim().endsWith(rightParen);
}

export function isObject(value) {
  var type = typeof value;
  return (
    value !== null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
}

export function isJsonLike(d: any) {
  return (
    typeof d === "string" &&
    (isObjectLike(d, "{", "}") || isObjectLike(d, "[", "]"))
  );
}

export const isColor = (value: string) =>
  typeof value === "string" && value.startsWith("#") && value.length === 7;
