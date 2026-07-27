<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'product_id'])]
class ContactLog extends Model
{
    protected $table = 'contacts_log';

    /**
     * L'utilisateur qui a contacté le vendeur.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Le produit pour lequel le contact a été initié.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
