export type Nullable<T> = T | null;

export interface HttpResult<R> {
  status: number;
  result: R;
}

export interface HttpOptions {
  method: 'get' | 'post' | 'put' | 'delete';
  headers?: Record<string, string>;
}

export type HttpParams = Record<string, string | number | boolean | unknown>;

export interface HttpClient {
  request<R>(
    pathname: string,
    params: HttpParams,
    options: HttpOptions,
  ): Promise<HttpResult<R>>;
}
