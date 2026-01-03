interface ApiResponse<T> {
  status: number
  data?: T
  error?: unknown
}

interface ApiHeaders {
  [key: string]: string
}

interface ApiData {
  [key: string]: unknown
}

interface ApiParams {
  endpoint: string
  data?: ApiData
  params?: ApiData
  headers?: ApiHeaders
}

interface CreateApiInstanceParams {
  baseURL: string
  headers?: ApiHeaders
}

const defaultHeaders: ApiHeaders = {
  'Content-Type': 'application/json',
}

interface ApiBase<T> {
  instance: T
}

interface ApiQueryAble {
  get<T>(params: ApiParams): Promise<ApiResponse<T>>
}

interface ApiInsertAble {
  post<T>(params: ApiParams): Promise<ApiResponse<T>>
}

interface ApiUpgradeAble {
  put<T>(params: ApiParams): Promise<ApiResponse<T>>
  patch<T>(params: ApiParams): Promise<ApiResponse<T>>
}

interface ApiRemoveAble {
  delete<T>(params: ApiParams): Promise<ApiResponse<T>>
}

export {
  ApiBase,
  ApiData,
  ApiHeaders,
  ApiInsertAble,
  ApiParams,
  ApiQueryAble,
  ApiRemoveAble,
  ApiResponse,
  ApiUpgradeAble,
  defaultHeaders,
  CreateApiInstanceParams,
}