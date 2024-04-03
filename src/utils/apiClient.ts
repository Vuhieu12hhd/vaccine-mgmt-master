import { METHOD } from 'config';
import { ACCESS_TOKEN } from 'config/localStorage';
import { getKey } from 'utils';

export const replacePlaceholder = (s: string, data: Record<string, unknown>) => {
  const parts = s.split(/{(.*?)}/g).map((v) => {
    const replaced = v.replace(/{/g, '');
    if (data instanceof FormData) {
      return data.get(replaced) || replaced;
    }
    return data[replaced] || replaced;
  });

  return parts.join('');
};

export const request = async (url: string, method: METHOD, body?: Record<string, unknown> | FormData, config?: { headers?: HeadersInit, noEndPoint?: boolean }) => {
  const { headers, noEndPoint } = config ?? {}
  let parsedUri = `${noEndPoint ? '' : process.env.REACT_APP_ENDPOINT ?? ''}${url}${method === METHOD.GET && body ? `?${new URLSearchParams(body as unknown as Record<string, string>)}` : ''
    }`;
  parsedUri = replacePlaceholder(parsedUri, body as unknown as Record<string, unknown> || {});
  const accessToken = getKey(ACCESS_TOKEN) as string;
  const res = await fetch(parsedUri, {
    method,
    headers: {
      ...headers,
      ...(!(body instanceof FormData) && { 'Content-Type': 'application/json; charset=UTF-8' }),
      ...accessToken && { Authorization: `Bearer ${accessToken}` }
    },
    ...method !== METHOD.GET && { body: body instanceof FormData ? body : JSON.stringify(body) },

  });

  if (!res.ok) {
    const error = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()

}
