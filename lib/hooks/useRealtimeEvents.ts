'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase, getEventsInWindow } from '@/lib/supabase'
import type { AnalyticsEvent } from '@/types/events'

const MAX_EVENTS = 200 // keep memory bounded

export function useRealtimeEvents(windowMinutes = 10) {
  const [events, setEvents]     = useState<AnalyticsEvent[]>([])
  const [connected, setConnected] = useState(false)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Load historical events on mount
  useEffect(() => {
    getEventsInWindow(windowMinutes)
      .then(setEvents)
      .catch(console.error)
  }, [windowMinutes])

  // Subscribe to realtime inserts
  useEffect(() => {
    const channel = supabase
      .channel('events-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          const newEvent = payload.new as AnalyticsEvent
          setEvents((prev) => {
            const updated = [newEvent, ...prev]
            return updated.slice(0, MAX_EVENTS)
          })
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { events, connected }
}
