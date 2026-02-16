export const objectTransformValues = <T extends object, S>(object: T, transformer: (value: T[keyof T]) => S): { [K in keyof T]: S } => {
  const result = {} as { [K in keyof T]: S };

  for (const key in object) {
    result[key] = transformer(object[key]);
  }

  return result;
};

export const deepCopy = <T>(value: T): T => {
  if (value == null) {
    return value;
  } else if (Array.isArray(value)) {
    return [...value.map(deepCopy)] as T;
  } else if (typeof value == 'object') {
    return objectTransformValues(value, deepCopy) as T;
  } else {
    return value;
  }
}

const isObject = (value: any): boolean => {
  return value != null && typeof value == 'object' && !Array.isArray(value);
};
export const objectDeepMerge = <T extends Record<string, any>>(base: T, object: Partial<Record<string, any>>): T => {
  const dupBase = deepCopy(base);
  for (const key in base) {
    const baseValue = base[key];
    const objectValue = object[key];
    if (isObject(baseValue) && isObject(objectValue)) {
      dupBase[key] = objectDeepMerge(baseValue, objectValue);
    } else if (key in object) {
      dupBase[key] = objectValue;
    }
  }
  return dupBase;
};
