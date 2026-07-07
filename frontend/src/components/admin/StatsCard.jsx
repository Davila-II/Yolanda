// src/components/admin/StatsCard.jsx
export default function StatsCard({ icon: Icon, value, label, color = 'terracotta' }) {
  return (
    <div className="bg-cream border border-cream-dark/50 rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        color === 'terracotta' ? 'bg-terracotta-light text-terracotta' :
        color === 'charcoal' ? 'bg-charcoal text-cream' :
        color === 'green' ? 'bg-green-50 text-success' :
        'bg-cream-dark text-gray-medium'
      }`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-charcoal">{value}</p>
        <p className="text-xs text-gray-medium">{label}</p>
      </div>
    </div>
  )
}
