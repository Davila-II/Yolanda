<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['url', 'position', 'product_id'])]
class ProductImage extends Model
{
    /**
     * Le produit auquel cette image appartient.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
