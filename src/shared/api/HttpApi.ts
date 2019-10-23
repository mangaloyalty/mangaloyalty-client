import * as app from '..';

export class HttpApi {
  delete<T>(url: string, data?: T) {
    return this._create('DELETE', url, data);
  }

  get(url: string) {
    return this._create('GET', url);
  }

  patch<T>(url: string, data?: T) {
    return this._create('PATCH', url, data);
  }

  post<T>(url: string, data?: T) {
    return this._create('POST', url, data);
  }

  put<T>(url: string, data?: T) {
    return this._create('PUT', url, data);
  }

  private _create<T>(method: string, url: string, data?: T) {
    return async <TResult>() => {
      const http = await this._xhrAsync(method, url, data);
      const error = http && http.status !== 200 ? parseError(http.responseText) : undefined;
      const status = http && http.status || 0;
      const value = http && http.status === 200 ? parseJson<TResult>(http.responseText) : undefined;
      return {error, status, value};
    };
  }

  private async _xhrAsync<T>(method: string, url: string, data?: T) {
    return await new Promise<XMLHttpRequest | undefined>((resolve) => {
      const request = new XMLHttpRequest();
      request.timeout = app.settings.contextTimeout;
      request.open(method, url);
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
