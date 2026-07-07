// src/pages/admin/UsersPage.jsx
import { useState } from 'react'
import DataTable from '../../components/admin/DataTable.jsx'

const MOCK_USERS = [
  { id: 1, name: 'Marie Kamga', email: 'marie@yolanda.cm', city: 'Douala', role: 'user', status: 'active' },
  { id: 2, name: 'Jean Fotso', email: 'jean@email.com', city: 'Yaoundé', role: 'user', status: 'active' },
  { id: 3, name: 'Alice Mbah', email: 'alice@email.com', city: 'Bafoussam', role: 'user', status: 'suspended' },
  { id: 4, name: 'Paul Njock', email: 'paul@email.com', city: 'Douala', role: 'user', status: 'active' },
  { id: 5, name: 'Sarah Etoga', email: 'sarah@email.com', city: 'Yaoundé', role: 'admin', status: 'active' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    )
  }

  const columns = [
    { header: 'Nom', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Ville', accessor: 'city' },
    {
      header: 'Statut',
      accessor: 'status',
      render: (row) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          row.status === 'active' ? 'bg-green-50 text-success' : 'bg-red-50 text-error'
        }`}>
          {row.status === 'active' ? 'Actif' : 'Suspendu'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Utilisateurs</h1>
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Rechercher un utilisateur..."
        renderActions={(row) => (
          <button
            onClick={() => toggleStatus(row.id)}
            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
              row.status === 'active'
                ? 'text-error hover:bg-red-50'
                : 'text-success hover:bg-green-50'
            }`}
          >
            {row.status === 'active' ? 'Suspendre' : 'Réactiver'}
          </button>
        )}
      />
    </div>
  )
}
