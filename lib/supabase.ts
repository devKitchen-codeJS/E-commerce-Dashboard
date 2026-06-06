import { createClient } from '@supabase/supabase-js'
import type { AnalyticsEvent } from '@/types/events'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export type Database = {
  public: {
    Tables: {
      events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'id'> & { id?: string }
      }
    }
  }
}

// Fetch recent events
export async function getRecentEvents(limit = 50): Promise<AnalyticsEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

// Fetch events in time window (minutes)
export async function getEventsInWindow(minutes = 10): Promise<AnalyticsEvent[]> {
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('timestamp', since)
    .order('timestamp', { ascending: true })

  if (error) throw error
  return data ?? []
}

// Insert single event
export async function insertEvent(
  event: Omit<AnalyticsEvent, 'id'>
): Promise<AnalyticsEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()

  if (error) throw error
  return data
}
