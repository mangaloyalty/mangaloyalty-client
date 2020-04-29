import * as app from '.';
let library: app.ILibraryContext;
let remote: app.IRemoteContext;
let session: app.ISessionContext;
let socket: app.ISocketContext;

export const api = {  
  get library() {
    return library || (library = new app.LibraryContext(createUrl()));
  },

  get remote() {
    return remote || (remote = new app.RemoteContext(createUrl()));
  },

  get session() {
    return session || (session = new app.SessionContext(createUrl()));
  },

  get socket() {
    return socket || (socket = new app.ContextSocketApi(createUrl()));
  },

  set library(value: app.ILibraryContext) {
    library = value;
  },
  
  set remote(value: app.IRemoteContext) {
    remote = value;
  },
  
  set session(value: app.ISessionContext) {
    session = value;
  },
  
  set socket(value: app.ISocketContext) {
    socket = value;
  }
};

function createUrl() {
  const protocol = location.protocol;
  const hostname = location.hostname;
  const port = location.port === '7767' ? '7783' : location.port;
  return `${protocol}//${hostname}:${port}`;
}
