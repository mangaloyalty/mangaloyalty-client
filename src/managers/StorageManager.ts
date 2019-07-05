const keyPrefix = 'mangaloyalty';

export class StorageManager {
  clear() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(keyPrefix)) continue;
      localStorage.removeItem(key);
    }
  }

  get(key: string) {
    return localStorage.getItem(`${keyPrefix}.${key}`) || '';
  }

  set(key: string, value?: string) {
    if (value) {
      localStorage.setItem(`${keyPrefix}.${key}`, value);
    } else {
      localStorage.removeItem(`${keyPrefix}.${key}`);
    }
  }
};
