import * as app from '..';

export class ActionContext {
  private readonly _baseUrl: string;
  private readonly _poll: app.ActionPoll;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._poll = new app.ActionPoll();
  }
  
  async listReadAsync(isLongPolling: boolean, previousResponseAt?: number) {
    const query = app.http.query(['isLongPolling', isLongPolling], ['previousResponseAt', previousResponseAt]);
    const request = app.http.get(`${this._baseUrl}/api/action` + query);
    const response = await request.json<app.IActionListReadResponse>();
    return response;
  }

  get poll() {
    return this._poll;
  }
}
