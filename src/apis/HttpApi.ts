import * as app from '..';

export class HttpApi {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  delete<T>(relativeUrl: string, data?: T) {
    return this._create('DELETE', relativeUrl, data);
  }

  get(relativeUrl: string) {
    return this._create('GET', relativeUrl);
  }

  patch<T>(relativeUrl: string, data: T) {
    return this._create('PATCH', relativeUrl, data);
  }

  post<T>(relativeUrl: string, data: T) {
    return this._create('POST', relativeUrl, data);
  }

  put<T>(relativeUrl: string, data: T) {
    return this._create('PUT', relativeUrl, data);
  }

  private _create<T>(method: string, relativeUrl: string, data?: T) {
    return async <TResult>() => {
      const http = await this._xhrAsync(method, relativeUrl, data);
      const error = http && http.status !== 200 ? parseError(http.responseText) : undefined;
      const result = http && http.status === 200 ? parseJson<TResult>(http.responseText) : undefined;
      return {error, result};
    };
  }

  private async _xhrAsync<T>(method: string, relativeUrl: string, data?: T) {
    return await new Promise<XMLHttpRequest | undefined>((resolve) => {
      const request = new XMLHttpRequest();
      request.timeout = app.settings.contextTimeout;
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
}

function parseError(text: string) {
  try {
    const result = JSON.parse(text) as {message?: string};
    const error = result && result.message;
    return error;
  } catch (error) {
    return;
  }
}

function parseJson<T>(text: string) {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    return;
  }
}
