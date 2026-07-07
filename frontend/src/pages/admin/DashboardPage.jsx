// src/pages/admin/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Users, Package, ShoppingBag, AlertTriangle } from 'lucide-react'
import StatsCard from '../../components/admin/StatsCard.jsx'
import { getAdminStats } from '../../api/admin.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAdminStats().then((res) => setStats(res.data.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} value={stats?.total_users ?? '—'} label="Utilisateurs" color="terracotta" />
        <StatsCard icon={Package} value={stats?.total_products ?? '—'} label="Annonces" color="charcoal" />
        <StatsCard icon={ShoppingBag} value={stats?.total_sales ?? '—'} label="Ventes" color="green" />
        <StatsCard icon={AlertTriangle} value={stats?.total_reports ?? '—'} label="Signalements" />
      </div>
    </div>
  )
}
