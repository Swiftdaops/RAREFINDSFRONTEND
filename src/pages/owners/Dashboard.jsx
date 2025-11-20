import React, { useEffect, useState } from 'react'
import { useOwnerStore } from '@/store/ownerStore'
import { useNavigate } from 'react-router-dom'

function formatPrice(p) {
  if (!p && p !== 0) return ''
  if (typeof p === 'object') {
    const amt = p.amount ?? p.value ?? ''
    const cur = p.currency ?? ''
    return `${cur ? cur : '₦'}${amt}`
  }
  return `₦${p}`
}

export default function Dashboard() {
  const { owner, ebooks, fetchEbooks } = useOwnerStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchEbooks()
      setLoading(false)
    }
    load()
  }, [fetchEbooks])

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Store summary card */}
        <div className="rounded-xl border border-slate-200/10 bg-white/5 p-4 backdrop-blur-sm glass lg:col-span-1">
          <div className="text-sm font-medium text-slate-500">Store</div>
          <div className="mt-1 text-2xl font-bold tracking-tight">{owner?.storeName || 'Your Store'}</div>
          {owner?.bio && <div className="mt-3 text-sm leading-relaxed text-slate-400">{owner.bio}</div>}
          <div className="mt-4 space-y-1 text-xs">
            {owner?.email && <div className="text-slate-500">Email: {owner.email}</div>}
            {(owner?.phone || owner?.whatsappNumber) && (
              <div className="text-slate-500">Phone: {owner?.phone || owner?.whatsappNumber}</div>
            )}
            {owner?.status && <div className="text-slate-500">Status: {owner.status}</div>}
          </div>
          <button
            onClick={() => navigate('/owner/products')}
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Manage Products
          </button>
        </div>

        {/* Recent books */}
        <div className="rounded-xl border border-slate-200/10 bg-white/5 p-4 backdrop-blur-sm glass lg:col-span-2">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">Your recent books</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-slate-200/10 bg-slate-200/10 p-2"
                >
                  <div className="aspect-3/4 w-full rounded-md bg-slate-300/20" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-slate-300/20" />
                  <div className="mt-1 h-3 w-1/2 rounded bg-slate-300/20" />
                </div>
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-sm text-slate-500">You have no books yet. Click Manage Products to add one.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ebooks.slice(0, 12).map((b) => (
                <div
                  key={b._id || b.id}
                  className="group flex flex-col rounded-lg border border-slate-200/10 bg-white/10 p-2 shadow-sm transition-all hover:border-slate-300/20 hover:bg-white/15"
                >
                  <div className="aspect-3/4 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-slate-900">
                    <img
                      src={b.coverImage?.url || b.coverUrl || '/logo192.png'}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/logo192.png'
                      }}
                    />
                  </div>
                  <div className="mt-2 flex-1">
                    <div className="line-clamp-2 text-xs font-medium leading-snug text-slate-700 dark:text-slate-200">
                      {b.title}
                    </div>
                    {b.author && (
                      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{b.author}</div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{formatPrice(b.price)}</div>
                    <button
                      onClick={() => navigate('/owner/products')}
                      className="text-[10px] font-medium text-blue-600 hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
