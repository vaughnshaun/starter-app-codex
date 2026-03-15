export interface ParsedEmailAction {
  accessToken?: string;
  errorCode?: string;
  errorDescription?: string;
  refreshToken?: string;
  tokenHash?: string;
  type: 'recovery' | 'verified';
}

function mergeSearchAndHash(url: URL): URLSearchParams {
  const params = new URLSearchParams(url.search);
  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);

  hashParams.forEach((value, key) => {
    if (!params.has(key)) {
      params.set(key, value);
    }
  });

  return params;
}

export function parseEmailAction(urlValue: string): ParsedEmailAction {
  const url = new URL(urlValue);
  const params = mergeSearchAndHash(url);
  const rawType = params.get('type');
  const type = rawType === 'recovery' ? 'recovery' : 'verified';

  return {
    accessToken: params.get('access_token') ?? undefined,
    errorCode: params.get('error_code') ?? undefined,
    errorDescription: params.get('error_description') ?? undefined,
    refreshToken: params.get('refresh_token') ?? undefined,
    tokenHash: params.get('token_hash') ?? undefined,
    type,
  };
}

