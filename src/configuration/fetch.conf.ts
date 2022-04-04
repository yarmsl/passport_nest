export const apiPost = async <T, K>(url: string, payload: K): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

export const apiPostWithToken = async <T, K>(
  url: string,
  payload: K,
  access_token: string,
): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};
