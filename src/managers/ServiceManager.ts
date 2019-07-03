const entries: {[key: string]: any} = {};

export const serviceManager = {
  get<T>(key: string) {
    if (!entries[key]) throw new Error(`Service does not exist: ${key}`);
    return entries[key] as T;
  },

  set<T>(key: string, value?: T) {
    entries[key] = value;
  }
};
