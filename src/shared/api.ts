import * as app from '.';
let library: app.ContextLibraryApi;
let remote: app.ContextRemoteApi;
let session: app.ContextSessionApi;
let socket: app.ContextSocketApi;

export const api = {  
  get library() {
    if (library) return library;
    library = new app.ContextLibraryApi(createUrl(), new app.HttpApi());
    return library;
  },

  get remote() {
    if (remote) return remote;
    remote = new app.ContextRemoteApi(createUrl(), new app.HttpApi());
    return remote;
  },

  get session() {
    if (session) return session;
    session = new app.ContextSessionApi(createUrl(), new app.HttpApi());
    return session;
  },

  get socket() {
    if (socket) return socket;
    socket = new app.ContextSocketApi(createUrl());
    return socket;
  }
};

function createUrl() {
  const protocol = location.protocol;
  const hostname = location.hostname;
  const port = location.port === '7767' ? '7783' : location.port;
  return `${protocol}//${hostname}:${port}`;
}
