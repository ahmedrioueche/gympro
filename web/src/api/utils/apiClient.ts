import { API_BASE_URL } from '../../constants/common';
import type { ApiResponse } from '../../types/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json();

  if (res.ok) {
    // Success response
    return {
      success: true,
      statusCode: res.status,
      data: data,
      message: data.message,
    };
  } else {
    // Error response
    return {
      success: false,
      statusCode: res.status,
      data: null as T,
      message: data.message || 'An error occurred',
    };
  }
}
