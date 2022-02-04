const baseUrl = process.env.REACT_APP_BASE_API_URL;

export async function post<T>(urlPath: string, body: any): Promise<T> {
  const response: Response = await fetch(
    `${baseUrl}${urlPath}`,
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body)
    }
  );
  return response.json();
}