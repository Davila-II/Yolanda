<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'brand' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:50'],
            'condition_state' => ['required', 'string', 'in:new,like_new,very_good,good,fair'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }
}
