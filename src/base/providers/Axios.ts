import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  ApiBase,
  ApiParams,
  ApiInsertAble,
  ApiResponse,
  CreateApiInstanceParams,
  defaultHeaders,
} from '../Api'

export class Axios implements ApiBase<AxiosInstance>, ApiInsertAble {
  instance: AxiosInstance

  constructor({ baseURL, headers = defaultHeaders }: CreateApiInstanceParams) {
    this.instance = axios.create({
      baseURL,
      headers,
    })
  }

  async post<T>({
    endpoint,
    data,
    headers,
  }: ApiParams): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(endpoint, data, {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })

      return {
        status: response.status,
        data: response.data,
      }
    } catch (error: unknown) {
      const err = error as AxiosError

      return {
        status: err.response?.status ?? 500,
        error: err,
      }
    }
  }
}