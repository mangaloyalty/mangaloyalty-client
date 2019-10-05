import * as app from '.';
let cacheLibrary: app.ContextLibraryApi;
let cacheRemote: app.ContextRemoteApi;
let cacheSession: app.ContextSessionApi;
let cacheSocket: app.ContextSocketApi;

export const api = {
  get library() {
    if (cacheLibrary) return cacheLibrary;
    cacheLibrary = new app.ContextLibraryApi(new app.HttpApi(createUrl()));
    return cacheLibrary;
  },

  get remote() {
    if (cacheRemote) return cacheRemote;
    cacheRemote = new app.ContextRemoteApi(new app.HttpApi(createUrl()));
    return cacheRemote;
  },

  get session() {
    if (cacheSession) return cacheSession;
    cacheSession = new app.ContextSessionApi(new app.HttpApi(createUrl()));
    return cacheSession;
  },

  get socket() {
    if (cacheSocket) return cacheSocket;
    cacheSocket = new app.ContextSocketApi(createUrl());
    return cacheSocket;
  }
};

function createUrl() {
  const protocol = location.protocol;
  const hostname = location.hostname;
  const port = location.port === '7767' ? '7783' : location.port;
  return `${protocol}//${hostname}:${port}`;
}
