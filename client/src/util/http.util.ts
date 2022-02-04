import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

export async function get<RespType>(urlPath: string): Promise<RespType> {
  const response = await instance.get(urlPath)
  return response.data;
}

export async function post<BodyType, RespType>(urlPath: string, body: BodyType): Promise<RespType> {
  const response = await instance.post(urlPath, body)
  return response.data;
}