interface PickFn {
  <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
}

export const pick: PickFn = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
};
