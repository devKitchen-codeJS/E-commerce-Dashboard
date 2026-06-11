'use client'

import { useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PulseDot } from '@/components/ui/PulseDot'
import { formatTime, eventLabel } from '@/lib/utils'
import type { AnalyticsEvent } from '@/types/events'

interface EventFeedProps {
  events: AnalyticsEvent[]
  connected: boolean
  maxVisible?: number
}

export function EventFeed({ events, connected, maxVisible = 40 }: EventFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const visible = events.slice(0, maxVisible)

  // Auto-scroll to top (newest events are prepended)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events.length])

  return (
    <Card className="flex flex-col" style={{ height: 420 }}>
      <CardHeader>
        <CardTitle>Live Event Feed</CardTitle>
        <div className="flex items-center gap-1.5">
          <PulseDot color={connected ? 'green' : 'amber'} />
          <span className="text-xs text-white/30">
            {connected ? 'live' : 'connecting...'}
          </span>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto pr-1">
        {visible.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-white/20">Waiting for events...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {visible.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </Card>
  )
}

function EventRow({ event }: { event: AnalyticsEvent }) {
  const productName = event.meta?.product_name as string | undefined

  return (
    <div className="animate-slide-in flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]">
      {/* Time */}
      <span className="w-16 flex-shrink-0 font-mono text-[10px] text-white/20">
        {formatTime(event.timestamp)}
      </span>

      {/* Session */}
      <span className="w-16 flex-shrink-0 truncate text-xs text-white/40">
        {event.session_id}
      </span>

      {/* Badge */}
      <Badge variant="event" eventType={event.type} className="flex-shrink-0">
        {event.type.replace(/_/g, ' ')}
      </Badge>

      {/* Description */}
      <span className="truncate text-xs text-white/50">
        {eventLabel(event.type, productName)}
      </span>

      {/* Value */}
      {event.value != null && (
        <span className="ml-auto flex-shrink-0 text-xs font-medium text-emerald-400">
          +${event.value.toFixed(2)}
        </span>
      )}
    </div>
  )
}
