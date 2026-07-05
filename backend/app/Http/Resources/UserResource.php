<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_whatsapp' => $this->phone_whatsapp,
            'role' => $this->role,
            'avatar' => $this->avatar,
            'city' => $this->city,
            'is_verified' => $this->is_verified,
            'rating' => $this->rating,
            'created_at' => $this->created_at,
        ];
    }
}
