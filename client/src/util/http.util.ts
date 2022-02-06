import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

export class RequestError extends Error {
  data: IRequestErrorData;
  constructor(data: any) {
    super(data?.message);
    this.data = data;
  }
}

export interface IRequestErrorData {
  statusCode: number;
  message?: string;
  error?: string;
}

const handleError = (err: AxiosError) => {
  const error = new RequestError(err.response?.data);
  throw(error);
}

export async function get<RespType>(urlPath: string): Promise<RespType> {
  const response = await instance.get(urlPath)
    .catch(handleError)

  return response.data;
}

export async function post<BodyType, RespType>(urlPath: string, body: BodyType): Promise<RespType> {
  const response = await instance.post(urlPath, body)
    .catch(handleError)

  return response.data;
}