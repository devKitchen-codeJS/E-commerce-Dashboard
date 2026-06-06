import type { AnalyticsEvent, EventType } from '@/types/events'

// ─── Static data pools ───────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'prod_001', name: 'Wireless Headphones', price: 129.99 },
  { id: 'prod_002', name: 'Mechanical Keyboard', price: 89.99 },
  { id: 'prod_003', name: 'USB-C Hub', price: 49.99 },
  { id: 'prod_004', name: 'Webcam 4K', price: 199.99 },
  { id: 'prod_005', name: 'Monitor Stand', price: 39.99 },
  { id: 'prod_006', name: 'Desk Lamp LED', price: 59.99 },
  { id: 'prod_007', name: 'Laptop Sleeve', price: 24.99 },
  { id: 'prod_008', name: 'Cable Management Kit', price: 14.99 },
]

// Weighted event distribution (realistic funnel shape)
const EVENT_WEIGHTS: { type: EventType; weight: number }[] = [
  { type: 'page_view',         weight: 40 },
  { type: 'product_view',      weight: 30 },
  { type: 'add_to_cart',       weight: 15 },
  { type: 'checkout_started',  weight: 10 },
  { type: 'purchase',          weight: 5  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weightedEventType(): EventType {
  const total = EVENT_WEIGHTS.reduce((s, e) => s + e.weight, 0)
  let rand = Math.random() * total
  for (const { type, weight } of EVENT_WEIGHTS) {
    rand -= weight
    if (rand <= 0) return type
  }
  return 'page_view'
}

function generateSessionId(): string {
  return `user_${randomInt(1, 200).toString().padStart(3, '0')}`
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateEvent(): Omit<AnalyticsEvent, 'id'> {
  const type = weightedEventType()
  const product = randomChoice(PRODUCTS)

  const base = {
    type,
    timestamp: new Date().toISOString(),
    session_id: generateSessionId(),
  }

  switch (type) {
    case 'page_view':
      return {
        ...base,
        meta: { page: randomChoice(['/', '/products', '/about', '/sale']) },
      }

    case 'product_view':
      return {
        ...base,
        product_id: product.id,
        meta: { product_name: product.name, price: product.price },
      }

    case 'add_to_cart':
      return {
        ...base,
        product_id: product.id,
        value: product.price,
        meta: { product_name: product.name, quantity: randomInt(1, 3) },
      }

    case 'checkout_started':
      return {
        ...base,
        product_id: product.id,
        value: product.price * randomInt(1, 3),
        meta: { product_name: product.name },
      }

    case 'purchase':
      return {
        ...base,
        product_id: product.id,
        value: product.price * randomInt(1, 2),
        meta: {
          product_name: product.name,
          order_id: `ord_${Date.now()}`,
        },
      }

    default:
      return base
  }
}

// ─── Metrics calculation (pure, no DB needed) ─────────────────────────────────

export function calculateKPIs(events: AnalyticsEvent[]) {
  const now = Date.now()
  const oneMinAgo = now - 60_000

  const recentEvents = events.filter(
    (e) => new Date(e.timestamp).getTime() > oneMinAgo
  )

  const purchases = events.filter((e) => e.type === 'purchase')
  const pageViews = events.filter((e) => e.type === 'page_view')

  const revenue = purchases.reduce((sum, e) => sum + (e.value ?? 0), 0)
  const conversionRate =
    pageViews.length > 0
      ? (purchases.length / pageViews.length) * 100
      : 0

  const activeSessions = new Set(
    events
      .filter((e) => new Date(e.timestamp).getTime() > now - 5 * 60_000)
      .map((e) => e.session_id)
  ).size

  return {
    activeUsers: activeSessions,
    revenue: Math.round(revenue * 100) / 100,
    conversionRate: Math.round(conversionRate * 10) / 10,
    eventsPerMinute: recentEvents.length,
  }
}

export function calculateFunnel(events: AnalyticsEvent[]) {
  const counts = {
    page_view: 0,
    product_view: 0,
    add_to_cart: 0,
    checkout_started: 0,
    purchase: 0,
  } as Record<EventType, number>

  events.forEach((e) => {
    counts[e.type] = (counts[e.type] ?? 0) + 1
  })

  const top = counts.page_view || 1

  return [
    { name: 'Page Views',        count: counts.page_view,        percentage: 100 },
    { name: 'Product Views',     count: counts.product_view,     percentage: Math.round((counts.product_view / top) * 100) },
    { name: 'Add to Cart',       count: counts.add_to_cart,      percentage: Math.round((counts.add_to_cart / top) * 100) },
    { name: 'Checkout Started',  count: counts.checkout_started, percentage: Math.round((counts.checkout_started / top) * 100) },
    { name: 'Purchase',          count: counts.purchase,         percentage: Math.round((counts.purchase / top) * 100) },
  ]
}

export function calculateTopProducts(events: AnalyticsEvent[]) {
  const map = new Map<string, { views: number; purchases: number; revenue: number; name: string }>()

  events.forEach((e) => {
    if (!e.product_id) return
    const name = (e.meta?.product_name as string) ?? e.product_id
    const entry = map.get(e.product_id) ?? { views: 0, purchases: 0, revenue: 0, name }

    if (e.type === 'product_view') entry.views++
    if (e.type === 'purchase') {
      entry.purchases++
      entry.revenue += e.value ?? 0
    }

    map.set(e.product_id, entry)
  })

  return Array.from(map.entries())
    .map(([product_id, data]) => ({ product_id, ...data }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
}

export { PRODUCTS }
