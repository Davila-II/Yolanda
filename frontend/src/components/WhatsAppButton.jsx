// src/components/WhatsAppButton.jsx
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton({
  phone,
  productTitle,
  className = '',
}) {
  if (!phone) return null

  // Nettoie le numéro
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  const message = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par votre article "${productTitle}" sur Yolanda. Est-il toujours disponible ?`
  )
  const url = `https://wa.me/${cleaned}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors ${className}`}
    >
      <MessageCircle size={18} />
      Contacter le vendeur
    </a>
  )
}
