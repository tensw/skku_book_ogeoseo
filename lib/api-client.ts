import type { ApiResponse, PaginatedResponse } from './types'

// ============================================================
// API Client - 공통 fetch 래퍼
// ============================================================

// --------------- 설정 ---------------

const DEFAULT_TIMEOUT_MS = 10_000 // 10초
const DEFAULT_MAX_RETRIES = 2
const DEFAULT_RETRY_DELAY_MS = 1_000 // 1초 (지수 백오프 기준)
const DEFAULT_BASE_URL = '/api'

// --------------- 타입 정의 ---------------

/** HTTP 메서드 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** API 요청 옵션 */
export interface ApiRequestOptions<TBody = unknown> {
  /** HTTP 메서드 (기본값: GET) */
  method?: HttpMethod
  /** 요청 바디 (POST/PUT/PATCH 에서 사용) */
  body?: TBody
  /** 추가 헤더 */
  headers?: Record<string, string>
  /** 요청 타임아웃(ms). 기본값: 10000 */
  timeout?: number
  /** 재시도 횟수. 기본값: 2 (GET 만 재시도) */
  maxRetries?: number
  /** 재시도 기본 딜레이(ms). 기본값: 1000 */
  retryDelay?: number
  /** 쿼리 파라미터 객체 */
  params?: Record<string, string | number | boolean | undefined | null>
  /** AbortSignal (외부에서 취소 제어) */
  signal?: AbortSignal
}

/** API 클라이언트 에러 - 네트워크, 타임아웃, HTTP 에러 구분 가능 */
export class ApiError extends Error {
  /** HTTP 상태 코드 (네트워크/타임아웃 에러일 경우 0) */
  public readonly status: number
  /** 서버가 반환한 에러 메시지 */
  public readonly serverMessage: string | null
  /** 에러 유형 구분 */
  public readonly type: 'network' | 'timeout' | 'http' | 'parse' | 'abort'

  constructor(
    message: string,
    status: number,
    type: 'network' | 'timeout' | 'http' | 'parse' | 'abort',
    serverMessage?: string | null,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.type = type
    this.serverMessage = serverMessage ?? null
  }

  /** 사용자에게 보여줄 수 있는 간결한 메시지 */
  get displayMessage(): string {
    if (this.serverMessage) return this.serverMessage

    switch (this.type) {
      case 'timeout':
        return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
      case 'network':
        return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해 주세요.'
      case 'abort':
        return '요청이 취소되었습니다.'
      case 'parse':
        return '서버 응답을 처리하는 중 오류가 발생했습니다.'
      case 'http':
        if (this.status === 401) return '인증이 필요합니다. 다시 로그인해 주세요.'
        if (this.status === 403) return '접근 권한이 없습니다.'
        if (this.status === 404) return '요청한 리소스를 찾을 수 없습니다.'
        if (this.status === 409) return '요청이 충돌했습니다. 다시 시도해 주세요.'
        if (this.status === 422) return '입력 데이터가 유효하지 않습니다.'
        if (this.status === 429) return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
        if (this.status >= 500) return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        return `요청 처리 중 오류가 발생했습니다. (${this.status})`
      default:
        return '알 수 없는 오류가 발생했습니다.'
    }
  }
}

// --------------- 유틸리티 함수 ---------------

/**
 * 쿼리 파라미터 객체를 URL 쿼리 문자열로 변환합니다.
 * undefined, null 값은 건너뜁니다.
 */
function buildQueryString(
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }

  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

/**
 * 지수 백오프 + 지터(jitter)를 적용한 재시도 딜레이를 계산합니다.
 */
function getRetryDelay(attempt: number, baseDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = exponentialDelay * 0.5 * Math.random()
  return exponentialDelay + jitter
}

/**
 * 재시도 대상 여부를 판단합니다.
 * GET 요청의 네트워크/타임아웃 에러 및 5xx 상태 코드만 재시도합니다.
 */
function isRetryable(error: ApiError, method: HttpMethod): boolean {
  // GET 요청만 자동 재시도 (POST/PUT/DELETE 는 멱등성을 보장할 수 없음)
  if (method !== 'GET') return false

  // 사용자가 의도적으로 취소한 경우 재시도하지 않음
  if (error.type === 'abort') return false

  // 네트워크 오류 또는 타임아웃은 재시도
  if (error.type === 'network' || error.type === 'timeout') return true

  // 서버 오류(5xx)는 재시도, 클라이언트 오류(4xx)는 재시도하지 않음
  if (error.type === 'http' && error.status >= 500) return true

  return false
}

/**
 * 지정된 ms 동안 대기합니다.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// --------------- 핵심 fetch 래퍼 ---------------

/**
 * 타임아웃이 적용된 fetch 를 실행합니다.
 * 외부 signal 과 타임아웃 signal 을 병합하여 처리합니다.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs)

  // 외부 signal 이 이미 취소된 경우 즉시 에러
  if (externalSignal?.aborted) {
    clearTimeout(timeoutId)
    throw new ApiError('Request aborted', 0, 'abort')
  }

  // 외부 signal 취소 시 타임아웃 컨트롤러도 함께 중단
  const onExternalAbort = () => timeoutController.abort()
  externalSignal?.addEventListener('abort', onExternalAbort, { once: true })

  try {
    const response = await fetch(url, {
      ...init,
      signal: timeoutController.signal,
    })
    return response
  } catch (error) {
    if (timeoutController.signal.aborted) {
      // 외부 signal 에 의한 취소인지 확인
      if (externalSignal?.aborted) {
        throw new ApiError('Request aborted', 0, 'abort')
      }
      throw new ApiError('Request timed out', 0, 'timeout')
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      'network',
    )
  } finally {
    clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', onExternalAbort)
  }
}

// --------------- 메인 API 함수 ---------------

/**
 * 공통 API 요청 함수입니다.
 *
 * - 자동 타임아웃 (기본 10초)
 * - GET 요청에 대한 지수 백오프 재시도 (기본 2회)
 * - 구조화된 에러 처리 (ApiError)
 * - JSON 직렬화/역직렬화 자동 처리
 * - 쿼리 파라미터 빌더 내장
 *
 * @example
 * ```ts
 * // GET 요청
 * const notices = await apiClient<PaginatedResponse<Notice>>('/notices', {
 *   params: { page: 1, pageSize: 10, search: '독서' },
 * })
 *
 * // POST 요청
 * const result = await apiClient<ApiResponse<Notice>>('/notices', {
 *   method: 'POST',
 *   body: { title: '새 공지', content: '내용' },
 * })
 * ```
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY_MS,
    params,
    signal,
  } = options

  const url = `${DEFAULT_BASE_URL}${endpoint}${buildQueryString(params)}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  }

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body !== undefined && method !== 'GET') {
    requestInit.body = JSON.stringify(body)
  }

  let lastError: ApiError | null = null
  const attempts = maxRetries + 1 // 최초 1회 + 재시도 횟수

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      // 재시도 시 딜레이
      if (attempt > 0) {
        await sleep(getRetryDelay(attempt - 1, retryDelay))
      }

      const response = await fetchWithTimeout(url, requestInit, timeout, signal)

      // HTTP 에러 처리
      if (!response.ok) {
        let serverMessage: string | null = null
        try {
          const errorBody = await response.json()
          serverMessage = errorBody?.error || errorBody?.message || null
        } catch {
          // 응답 바디 파싱 실패는 무시
        }

        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          'http',
          serverMessage,
        )
      }

      // 204 No Content 처리
      if (response.status === 204) {
        return undefined as T
      }

      // JSON 파싱
      try {
        const data: T = await response.json()
        return data
      } catch {
        throw new ApiError('Failed to parse response JSON', 0, 'parse')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        lastError = error
      } else {
        lastError = new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          0,
          'network',
        )
      }

      // 재시도 가능한 에러가 아니면 즉시 throw
      if (!isRetryable(lastError, method)) {
        throw lastError
      }

      // 마지막 시도였으면 throw
      if (attempt === attempts - 1) {
        throw lastError
      }
    }
  }

  // 이론상 도달하지 않지만 TypeScript 만족을 위해
  throw lastError ?? new ApiError('Unknown error', 0, 'network')
}

// --------------- 편의 메서드 ---------------

/** GET 요청 단축 함수 */
export function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  options?: Omit<ApiRequestOptions, 'method' | 'body' | 'params'>,
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'GET', params })
}

/** POST 요청 단축 함수 */
export function apiPost<T, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>,
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'POST', body })
}

/** PUT 요청 단축 함수 */
export function apiPut<T, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>,
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'PUT', body })
}

/** PATCH 요청 단축 함수 */
export function apiPatch<T, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>,
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'PATCH', body })
}

/** DELETE 요청 단축 함수 */
export function apiDelete<T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>,
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'DELETE' })
}

// --------------- 에러 처리 유틸리티 ---------------

/**
 * API 에러에서 사용자에게 표시할 메시지를 추출합니다.
 *
 * @example
 * ```ts
 * try {
 *   await apiClient('/notices')
 * } catch (error) {
 *   toast({ title: '오류', description: getErrorMessage(error) })
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.displayMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * 에러가 특정 HTTP 상태 코드인지 확인합니다.
 */
export function isHttpError(error: unknown, status: number): boolean {
  return error instanceof ApiError && error.type === 'http' && error.status === status
}

/**
 * 에러가 네트워크 관련 에러인지 확인합니다.
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && (error.type === 'network' || error.type === 'timeout')
}

/**
 * 에러가 인증 관련 에러(401)인지 확인합니다.
 */
export function isAuthError(error: unknown): boolean {
  return isHttpError(error, 401)
}

// --------------- 도메인별 API 함수 ---------------

import type { Notice, BookReview, Classic100, Program } from './types'

/** 공지사항 API */
export const noticesApi = {
  /** 공지사항 목록 조회 (페이지네이션) */
  getList: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiGet<PaginatedResponse<Notice>>('/notices', params),

  /** 공지사항 상세 조회 */
  getById: (id: number) =>
    apiGet<ApiResponse<Notice>>(`/notices/${id}`),

  /** 공지사항 생성 */
  create: (data: Omit<Notice, 'id' | 'date' | 'views'>) =>
    apiPost<ApiResponse<Notice>>('/notices', data),

  /** 공지사항 수정 */
  update: (id: number, data: Partial<Notice>) =>
    apiPut<ApiResponse<Notice>>(`/notices/${id}`, data),

  /** 공지사항 삭제 */
  delete: (id: number) =>
    apiDelete<ApiResponse<void>>(`/notices/${id}`),
}

/** 서평 API */
export const reviewsApi = {
  /** 서평 목록 조회 (페이지네이션, 필터링) */
  getList: (params?: { page?: number; pageSize?: number; search?: string; type?: string }) =>
    apiGet<PaginatedResponse<BookReview>>('/reviews', params),

  /** 서평 상세 조회 */
  getById: (id: number) =>
    apiGet<ApiResponse<BookReview>>(`/reviews/${id}`),

  /** 서평 생성 */
  create: (data: Omit<BookReview, 'id' | 'likes' | 'comments' | 'timeAgo'>) =>
    apiPost<ApiResponse<BookReview>>('/reviews', data),

  /** 서평 수정 */
  update: (id: number, data: Partial<BookReview>) =>
    apiPut<ApiResponse<BookReview>>(`/reviews/${id}`, data),

  /** 서평 삭제 */
  delete: (id: number) =>
    apiDelete<ApiResponse<void>>(`/reviews/${id}`),
}

/** 고전 100선 API */
export const classicsApi = {
  /** 고전 목록 조회 (페이지네이션, 필터링) */
  getList: (params?: { page?: number; pageSize?: number; search?: string; category?: string; year?: number }) =>
    apiGet<PaginatedResponse<Classic100>>('/classics', params),

  /** 고전 상세 조회 */
  getById: (id: number) =>
    apiGet<ApiResponse<Classic100>>(`/classics/${id}`),

  /** 고전 생성 */
  create: (data: Omit<Classic100, 'id'>) =>
    apiPost<ApiResponse<Classic100>>('/classics', data),

  /** 고전 수정 */
  update: (id: number, data: Partial<Classic100>) =>
    apiPut<ApiResponse<Classic100>>(`/classics/${id}`, data),

  /** 고전 삭제 */
  delete: (id: number) =>
    apiDelete<ApiResponse<void>>(`/classics/${id}`),
}

/** 프로그램 API */
export const programsApi = {
  /** 프로그램 목록 조회 (페이지네이션) */
  getList: (params?: { page?: number; pageSize?: number }) =>
    apiGet<PaginatedResponse<Program>>('/programs', params),

  /** 프로그램 생성 */
  create: (data: Omit<Program, 'id' | 'participants'>) =>
    apiPost<ApiResponse<Program>>('/programs', data),
}

/** 관리자 통계 API */
export const adminApi = {
  /** 통계 조회 */
  getStats: () =>
    apiGet<{ notices: number; reviews: number; classics: number; programs: number }>('/admin/stats'),
}
