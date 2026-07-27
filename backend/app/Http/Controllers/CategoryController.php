<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Liste de toutes les catégories (hiérarchique).
     */
    public function index(): JsonResponse
    {
        $categories = Category::with(['children.children'])
            ->root()
            ->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * Détail d'une catégorie par slug.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::with(['children', 'parent'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['data' => $category]);
    }
}
