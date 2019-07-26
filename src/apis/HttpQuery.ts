export class HttpQuery {
  private readonly _params: string[];
  
  constructor() {
    this._params = [];
  }

  add(key: string, value?: boolean | number | string) {
    if (typeof value === 'undefined') return this;
    if (typeof value === 'string' && !value) return this;
    this._params.push(`${key}=${encodeURIComponent(value)}`);
    return this;
  }

  toString() {
    if (this._params.length === 0) return '';
    return `?${this._params.join('&')}`;
  }
}
