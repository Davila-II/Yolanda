<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'price', 'original_price', 'condition', 'size', 'brand', 'color', 'status', 'seller_id', 'category_id'])]
class Product extends Model
{
    use HasFactory;
    /**
     * Le vendeur du produit.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * La catégorie du produit.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Les images du produit.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    /**
     * Les favoris associés à ce produit.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Les avis sur ce produit.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * L'historique des contacts WhatsApp pour ce produit.
     */
    public function contactsLog(): HasMany
    {
        return $this->hasMany(ContactLog::class);
    }

    /**
     * Les signalements de ce produit.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Scope: produits publiés.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Vérifie si le produit est en favori pour un utilisateur donné.
     */
    public function isFavoritedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->favorites()->where('user_id', $user->id)->exists();
    }

    /**
     * Prix formaté en FCFA.
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 0, ',', ' ') . ' FCFA';
    }
}
