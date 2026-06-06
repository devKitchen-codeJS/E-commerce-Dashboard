export type EventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_started'
  | 'purchase'

export interface AnalyticsEvent {
  id: string
  type: EventType
  timestamp: string
  session_id: string
  product_id?: string
  value?: number
  meta?: Record<string, unknown>
}

export interface KPIMetrics {
  activeUsers: number
  revenue: number
  conversionRate: number
  eventsPerMinute: number
}

export interface FunnelStep {
  name: string
  count: number
  percentage: number
}

export interface TopProduct {
  product_id: string
  views: number
  purchases: number
  revenue: number
}
