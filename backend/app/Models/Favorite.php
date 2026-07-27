<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    /**
     * Pas d'auto-incrément : la clé primaire est composite.
     */
    public $incrementing = false;

    protected $primaryKey = null; // composite : user_id + product_id

    /**
     * L'utilisateur qui a mis en favori.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Le produit mis en favori.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
