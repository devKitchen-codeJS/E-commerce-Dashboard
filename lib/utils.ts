import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { EventType } from '@/types/events'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  return `${Math.floor(diff / 3_600_000)}h ago`
}

// Human-readable event description
export function eventLabel(type: EventType, productName?: string): string {
  const name = productName ?? 'a product'
  switch (type) {
    case 'page_view':        return 'visited the store'
    case 'product_view':     return `viewed ${name}`
    case 'add_to_cart':      return `added ${name} to cart`
    case 'checkout_started': return `started checkout for ${name}`
    case 'purchase':         return `purchased ${name}`
  }
}

// Event type → badge color
export function eventColor(type: EventType): string {
  switch (type) {
    case 'page_view':        return 'text-slate-400'
    case 'product_view':     return 'text-blue-400'
    case 'add_to_cart':      return 'text-amber-400'
    case 'checkout_started': return 'text-orange-400'
    case 'purchase':         return 'text-emerald-400'
  }
}

export function eventBadgeColor(type: EventType): string {
  switch (type) {
    case 'page_view':        return 'bg-slate-800 text-slate-300 border-slate-700'
    case 'product_view':     return 'bg-blue-950 text-blue-300 border-blue-800'
    case 'add_to_cart':      return 'bg-amber-950 text-amber-300 border-amber-800'
    case 'checkout_started': return 'bg-orange-950 text-orange-300 border-orange-800'
    case 'purchase':         return 'bg-emerald-950 text-emerald-300 border-emerald-800'
  }
}
