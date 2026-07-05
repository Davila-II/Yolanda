<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'brand' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:50'],
            'condition_state' => ['sometimes', 'string', 'in:new,like_new,very_good,good,fair'],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:99999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'status' => ['sometimes', 'string', 'in:draft,published,sold,archived'],
        ];
    }
}
