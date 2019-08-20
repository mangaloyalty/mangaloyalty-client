export class ServiceManager {
  private _entries: {[key: string]: any};

  constructor() {
    this._entries = {};
  }
  
  get<T>(key: string) {
    if (!this._entries[key]) throw new Error(`Service does not exist: ${key}`);
    return this._entries[key] as T;
  }

  set<T>(key: string, value?: T) {
    this._entries[key] = value;
  }
}
