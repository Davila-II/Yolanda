<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        $category->load('children');

        return new CategoryResource($category);
    }
}
