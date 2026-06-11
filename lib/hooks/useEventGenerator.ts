'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { generateEvent } from '@/lib/eventGenerator'
import { insertEvent } from '@/lib/supabase'

const MIN_INTERVAL = 300
const MAX_INTERVAL = 1000

export function useEventGenerator() {
  const [running, setRunning]   = useState(true)
  const [count, setCount]       = useState(0)
  const [error, setError]       = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleNext = useCallback(() => {
    const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)
    timerRef.current = setTimeout(async () => {
      try {
        const event = generateEvent()
        await insertEvent(event)
        setCount((c) => c + 1)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Insert failed')
      }
      scheduleNext()
    }, delay)
  }, [])

  useEffect(() => {
    if (running) {
      scheduleNext()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [running, scheduleNext])

  const toggle = () => {
    if (running && timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setRunning((r) => !r)
  }

  return { running, count, error, toggle }
}
