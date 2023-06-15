import { HttpClient, HttpParams, HttpResult } from '../types';

export class Requester {
  constructor(
    private readonly _token: string,
    private readonly _client: HttpClient,
  ) { }

  private readonly _headers = {
    'Authorization': `Bearer ${this._token}`,
    'Content-Type': 'application/json;charset=utf-8',
  };

  private _wrapResponse<R>(result: HttpResult<R>, pathname: string): R {
    if (result.status > 206) {
      throw new Error(`Cannot recieve data for ${pathname}`);
    }

    return result.result;
  }

  async get<R>(pathname: string, params: HttpParams): Promise<R> {
    const result = await this._client.request<R>(pathname, params, {
      method: 'get',
      headers: this._headers
    });

    return this._wrapResponse(result, pathname);
  }
}
