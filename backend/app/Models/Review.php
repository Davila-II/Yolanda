<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['rating', 'comment', 'reviewer_id', 'seller_id', 'product_id'])]
class Review extends Model
{
    /**
     * L'utilisateur qui a laissé l'avis.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Le vendeur concerné par l'avis.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Le produit concerné par l'avis.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
