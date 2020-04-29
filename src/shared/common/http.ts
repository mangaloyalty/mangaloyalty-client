export const http = {
  delete<T>(url: string, data?: T) {
    return createWrapper('DELETE', url, data);
  },

  get(url: string) {
    return createWrapper('GET', url);
  },
  
  patch<T>(url: string, data?: T) {
    return createWrapper('PATCH', url, data);
  },

  post<T>(url: string, data?: T) {
    return createWrapper('POST', url, data);
  },

  put<T>(url: string, data?: T) {
    return createWrapper('PUT', url, data);
  },

  query(...values: [string, boolean | number | string | undefined][]) {
    return `?${values.map(x => {
      if (typeof x[1] === 'undefined') return;
      if (typeof x[1] === 'string' && !x[0]) return;
      return `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`;
    }).filter(Boolean).join('&')}`;
  }
}

function createWrapper<T>(method: string, url: string, data?: T) {
  const blob = () => requestAsync(method, url, data, (response) => response.blob());
  const imageData = () => requestAsync(method, url, data, (response) => response.blob().then(imageDataAsync));
  const json = <T>() => requestAsync(method, url, data, (response) => response.json() as Promise<T>);
  const status = () => requestAsync(method, url, data, () => Promise.resolve());
  return {blob, imageData, json, status};
}

function imageDataAsync(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('error', () => reject());
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.readAsDataURL(blob);
  });
}

async function requestAsync<TK, TV>(method: string, url: string, data?: TK, valueFactory?: (response: Response) => Promise<TV>) {
  try {
    const body = data && JSON.stringify(data);
    const headers = data && {'Content-Type': 'application/json'};
    const response = await fetch(url, {method, headers, body});
    if (response.status === 200) try {
      const status = response.status;
      const value = valueFactory && await valueFactory(response);
      return {status, value};
    } catch {
      const status = response.status;
      return {status};
    } else try {
      const data = await response.json() as {message?: string};
      const error = data.message;
      const status = response.status;
      return {status, error};
    } catch {
      const status = response.status;
      return {status};
    }
  } catch {
    const status = 0;
    return {status};
  }
}
