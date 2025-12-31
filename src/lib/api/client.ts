interface ApiOptions {
  method?: string;
  headers?: HeadersInit;
  body?: any;
}

export async function apiFetch<T>(url: string, options?: ApiOptions): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: options?.method || 'GET',
    headers: { ...defaultHeaders, ...options?.headers },
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}

