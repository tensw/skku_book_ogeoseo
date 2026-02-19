"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, ApiError, getErrorMessage } from '@/lib/api-client'
import type { ApiRequestOptions } from '@/lib/api-client'

/**
 * 범용 API 데이터 패칭 훅.
 *
 * 기존 인터페이스(url 기반)를 유지하면서 내부적으로 api-client 를 사용합니다.
 * - 자동 타임아웃 (10초)
 * - GET 요청 자동 재시도 (2회, 지수 백오프)
 * - 구조화된 에러 메시지 (ApiError)
 * - 컴포넌트 언마운트 시 요청 자동 취소
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useApi<PaginatedResponse<Notice>>('/api/notices?page=1')
 * ```
 */
export function useApi<T>(url: string | null, options?: Omit<ApiRequestOptions, 'signal'>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    // 이전 요청이 진행 중이면 취소
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      // url 이 '/api/...' 형태이면 base URL 을 제거하고 endpoint 만 추출
      // 그 외(절대 URL 등)는 그대로 apiClient 에 전달
      let endpoint = url
      if (url.startsWith('/api/')) {
        endpoint = url.replace(/^\/api/, '')
      } else if (url.startsWith('/api')) {
        endpoint = url.replace(/^\/api/, '') || '/'
      }

      // 쿼리 파라미터를 URL 에서 분리
      const [path, queryString] = endpoint.split('?')
      const params: Record<string, string> = {}
      if (queryString) {
        const searchParams = new URLSearchParams(queryString)
        searchParams.forEach((value, key) => {
          params[key] = value
        })
      }

      const json = await apiClient<T>(path, {
        ...options,
        method: 'GET',
        params: Object.keys(params).length > 0 ? params : undefined,
        signal: controller.signal,
      })

      // 취소된 요청의 결과는 무시
      if (!controller.signal.aborted) {
        setData(json)
      }
    } catch (e) {
      // 취소된 요청의 에러는 무시
      if (e instanceof ApiError && e.type === 'abort') return
      if (!controller.signal.aborted) {
        setError(getErrorMessage(e))
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [url, options])

  useEffect(() => {
    fetchData()

    // 클린업: 컴포넌트 언마운트 시 진행 중인 요청 취소
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * 뮤테이션(POST/PUT/DELETE) 전용 훅.
 *
 * useApi 와 달리 자동 실행되지 않으며, mutate() 호출 시 요청을 보냅니다.
 *
 * @example
 * ```tsx
 * const { mutate, loading, error } = useMutation<ApiResponse<Notice>>()
 *
 * const handleSubmit = async () => {
 *   const result = await mutate('/notices', {
 *     method: 'POST',
 *     body: { title: '새 공지', content: '내용' },
 *   })
 *   if (result) toast({ title: '공지 등록 완료' })
 * }
 * ```
 */
export function useMutation<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'signal'>,
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient<T>(endpoint, options)
      setData(result)
      return result
    } catch (e) {
      const message = getErrorMessage(e)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, mutate, reset }
}

/**
 * 페이지네이션 상태 관리 훅.
 */
export function usePagination(totalPages: number) {
  const [page, setPage] = useState(1)

  const next = () => setPage(p => Math.min(p + 1, totalPages))
  const prev = () => setPage(p => Math.max(p - 1, 1))
  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)))

  return { page, next, prev, goTo, totalPages }
}
