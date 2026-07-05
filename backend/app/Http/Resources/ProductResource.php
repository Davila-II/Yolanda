<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'brand' => $this->brand,
            'size' => $this->size,
            'condition_state' => $this->condition_state,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'discount_percent' => $this->discount_percent,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'user' => new UserResource($this->whenLoaded('user')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at,
        ];
    }
}
