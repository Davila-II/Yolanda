// src/components/admin/DataTable.jsx
import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({
  columns,
  data = [],
  searchPlaceholder = 'Rechercher...',
  pageSize = 10,
  renderActions,
  emptyMessage = 'Aucune donnée.',
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? row[col.accessor] : ''
        return String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, columns])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div>
      {/* Barre de recherche */}
      <div className="relative max-w-xs mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder={searchPlaceholder}
          className="w-full bg-cream-dark rounded-lg pl-9 pr-3 py-2 text-sm text-charcoal placeholder:text-gray-light outline-none focus:ring-1 focus:ring-terracotta/30"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark/50">
              {columns.map((col, i) => (
                <th key={i} className="text-left text-xs text-gray-light uppercase tracking-wider font-medium px-4 py-3 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {renderActions && (
                <th className="text-right text-xs text-gray-light uppercase tracking-wider font-medium px-4 py-3 whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-12 text-sm text-gray-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => (
                <tr key={row.id || ri} className="border-b border-cream-dark/30 hover:bg-cream-dark/30 transition-colors">
                  {columns.map((col, ci) => (
                    <td key={ci} className="px-4 py-3 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3 text-right">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-medium">
          <span>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-cream-dark disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-cream-dark disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
