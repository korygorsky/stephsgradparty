export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

export async function postJson<T>(
  url: string,
  body: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') ?? '';
    const payload = ct.includes('application/json') ? await res.json() : null;
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: (payload && payload.error) || res.statusText,
      };
    }
    return { ok: true, data: payload as T };
  } catch (err) {
    return { ok: false, status: 0, message: (err as Error).message };
  }
}

export async function postForm<T>(
  url: string,
  form: FormData,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'POST', body: form });
    const ct = res.headers.get('content-type') ?? '';
    const payload = ct.includes('application/json') ? await res.json() : null;
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: (payload && payload.error) || res.statusText,
      };
    }
    return { ok: true, data: payload as T };
  } catch (err) {
    return { ok: false, status: 0, message: (err as Error).message };
  }
}
