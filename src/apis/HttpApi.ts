export class HttpApi {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async deleteAsync<T>(relativeUrl: string, data?: T) {
    return this._fetchAsync('DELETE', relativeUrl, data);
  }

  async getAsync(relativeUrl: string) {
    return this._fetchAsync('GET', relativeUrl);
  }

  async patchAsync<T>(relativeUrl: string, data: T) {
    return this._fetchAsync('PATCH', relativeUrl, data);
  }

  async postAsync<T>(relativeUrl: string, data: T) {
    return this._fetchAsync('POST', relativeUrl, data);
  }

  async putAsync<T>(relativeUrl: string, data: T) {
    return this._fetchAsync('PUT', relativeUrl, data);
  }

  private async _createAsync<T>(method: string, relativeUrl: string, data?: T) {
    return await new Promise<XMLHttpRequest | undefined>((resolve) => {
      const request = new XMLHttpRequest();
      request.timeout = 10000;
      request.open(method, this._baseUrl + relativeUrl);
      request.addEventListener('abort', () => resolve());
      request.addEventListener('error', () => resolve());
      request.addEventListener('load', () => resolve(request));
      request.addEventListener('timeout', () => resolve());
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(data ? JSON.stringify(data) : undefined);
    });
  }

  private async _fetchAsync<T>(method: string, relativeUrl: string, data?: T) {
    const response = await this._createAsync(method, relativeUrl, data);
    const status = response ? response.status : 0;
    const text = response ? response.responseText : '';
    return {parseJson: <TParse>() => parseJson<TParse>(text), status, text};
  }
}

function parseJson<T>(text: string) {
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    return undefined;
  }
}
