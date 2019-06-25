const entries: {[key: string]: any} = {};

export const serviceManager = {
  get<T>(key: string) {
    if (entries[key]) return entries[key] as T;
    throw new Error(`Service does not exist: ${key}`);
  },

  set<T>(key: string, value?: T) {
    entries[key] = value;
  }
};
