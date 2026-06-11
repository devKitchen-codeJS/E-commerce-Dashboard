import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface Product {
  product_id: string
  name: string
  views: number
  purchases: number
  revenue: number
}

interface TopProductsProps {
  products: Product[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxViews = products[0]?.views || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>

      <div className="flex flex-col gap-3">
        {products.length === 0 && (
          <p className="py-4 text-center text-xs text-white/20">No data yet...</p>
        )}

        {products.map((product, i) => (
          <div key={product.product_id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Rank */}
                <span className="w-4 text-xs font-medium text-white/20">
                  {i + 1}
                </span>
                <span className="text-sm text-white/80">{product.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{product.views.toLocaleString()} views</span>
                <span className="text-emerald-400">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-indigo-500/60 transition-all duration-500"
                style={{ width: `${(product.views / maxViews) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
