import { HttpClient, HttpOptions, HttpResult } from '@internal/tmdb';

export class FetchHttpClient implements HttpClient {
  constructor(private readonly _baseURL: string) { }

  async request<R>(pathname: string, params: Record<string, string>, options: HttpOptions): Promise<HttpResult<R>> {
    const searchParams = new URLSearchParams(params);

    const result = await fetch(`${this._baseURL}/${pathname}${options.method === 'get' ? `?${searchParams}` : ''}`, {
      method: options.method,
      headers: options.headers ?? {},
      body: options.method !== 'get' ? searchParams : null
    });

    return {
      status: result.status,
      result: await result.json(),
    };
  }
}
