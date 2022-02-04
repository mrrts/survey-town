export const baseUrl = process.env.REACT_APP_BASE_API_URL;

const baseConfig: Partial<RequestInit> = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'no-cache'
};

export async function get<RespType>(urlPath: string): Promise<RespType> {
  const response = await fetch(
    `${baseUrl}${urlPath}`,
    {
      ...baseConfig,
      method: 'GET'
    }
  );
  return response.json();
}

export async function post<BodyType, RespType>(urlPath: string, body: BodyType): Promise<RespType> {
  const response: Response = await fetch(
    `${baseUrl}${urlPath}`,
    {
      ...baseConfig,
      method: 'POST',
      body: JSON.stringify(body)
    }
  );
  return response.json();
}