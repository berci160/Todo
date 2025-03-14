export enum Methods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum Status {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export interface RequestConfig extends Omit<RequestInit, 'method' | 'body'> {
  resource: string;
  method?: Methods;
  params?: Record<string, any>;
  body?: Record<string, any>;
}

export async function request<T = void>({
  resource,
  method = Methods.GET,
  params,
  body,
  headers,
  ...config
}: RequestConfig): Promise<T> {
  const baseUrl = 'https://programming-quotes-api.azurewebsites.net/api';
  const url = new URL(`${baseUrl}/${resource}`);

  if (params) {
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  }

  const fetchConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...config,
  };

  // Include body for POST, PUT, PATCH methods
  if (body && (method === Methods.POST || method === Methods.PUT || method === Methods.PATCH)) {
    fetchConfig.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchConfig);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export default request;
