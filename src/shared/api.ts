import * as app from '.';
let cacheLibrary: app.ContextLibraryApi;
let cacheRemote: app.ContextRemoteApi;
let cacheSession: app.ContextSessionApi;

export const api = {
  get library() {
    if (cacheLibrary) return cacheLibrary;
    cacheLibrary = new app.ContextLibraryApi(createHttp());
    return cacheLibrary;
  },

  get remote() {
    if (cacheRemote) return cacheRemote;
    cacheRemote = new app.ContextRemoteApi(createHttp());
    return cacheRemote;
  },

  get session() {
    if (cacheSession) return cacheSession;
    cacheSession = new app.ContextSessionApi(createHttp());
    return cacheSession;
  }
};

function createHttp() {
  return new app.HttpApi(`${location.protocol}//${location.hostname}:${location.port === '7767' ? '7783' : location.port}`);
}
