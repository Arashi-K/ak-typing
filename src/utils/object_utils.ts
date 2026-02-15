export const objectTransformValues = <T extends object, S>(object: T, transformer: (value: T[keyof T]) => S): { [K in keyof T]: S } => {
  const result = {} as { [K in keyof T]: S };

  for (const key in object) {
    result[key] = transformer(object[key]);
  }

  return result;
};
