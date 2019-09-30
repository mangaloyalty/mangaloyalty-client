const keyPrefix = 'mangaloyalty';

export class StorageManager {
  get<T extends string>(key: string, defaultValue: T) {
    return localStorage.getItem(`${keyPrefix}.${key}`) as T || defaultValue;
  }

  set(key: string, value?: string) {
    if (value) {
      localStorage.setItem(`${keyPrefix}.${key}`, value);
    } else {
      localStorage.removeItem(`${keyPrefix}.${key}`);
    }
  }
}
