// src/components/ImageGallery.jsx
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImageGallery({ images = [] }) {
  const [current, setCurrent] = useState(0)

  const hasImages = images.length > 0
  const total = hasImages ? images.length : 1

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1))
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1))

  return (
    <div>
      {/* Vue principale */}
      <div className="relative aspect-[4/5] bg-cream-dark rounded-lg overflow-hidden mb-3">
        {hasImages ? (
          <>
            <img
              src={images[current]}
              alt={`Photo ${current + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Flèches */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal hover:bg-white transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal hover:bg-white transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Indicateurs */}
            {total > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === current ? 'bg-white' : 'bg-white/40'
                    }`}
                    aria-label={`Aller à l'image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-light text-sm">Image indisponible</span>
          </div>
        )}
      </div>

      {/* Miniatures desktop */}
      {hasImages && total > 1 && (
        <div className="hidden md:flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                i === current ? 'border-terracotta' : 'border-transparent hover:border-gray-light'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
