// src/pages/admin/ReportsPage.jsx
import { useState } from 'react'
import DataTable from '../../components/admin/DataTable.jsx'

const MOCK_REPORTS = [
  { id: 1, product: 'Robe fleurie en wax', reason: 'Contenu inapproprié', reporter: 'Jean F.', date: '2026-07-05', status: 'pending' },
  { id: 2, product: 'Blazer vintage', reason: 'Article contrefait', reporter: 'Alice M.', date: '2026-07-04', status: 'pending' },
  { id: 3, product: 'Sac à main en cuir', reason: 'Spam', reporter: 'Paul N.', date: '2026-07-03', status: 'resolved' },
  { id: 4, product: 'Jean mom taille haute', reason: 'Information trompeuse', reporter: 'Sarah E.', date: '2026-07-02', status: 'pending' },
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState(MOCK_REPORTS)

  const resolve = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    )
  }

  const columns = [
    { header: 'Article', accessor: 'product' },
    { header: 'Motif', accessor: 'reason' },
    { header: 'Signalé par', accessor: 'reporter' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Statut',
      accessor: 'status',
      render: (row) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          row.status === 'pending' ? 'bg-orange-50 text-terracotta' : 'bg-green-50 text-success'
        }`}>
          {row.status === 'pending' ? 'En attente' : 'Traité'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Signalements</h1>
      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Rechercher un signalement..."
        renderActions={(row) =>
          row.status === 'pending' ? (
            <button
              onClick={() => resolve(row.id)}
              className="text-xs font-medium text-terracotta hover:underline"
            >
              Traiter
            </button>
          ) : null
        }
      />
    </div>
  )
}
