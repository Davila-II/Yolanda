<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favorites()
            ->with('product.category', 'product.user', 'product.images')
            ->latest()
            ->get()
            ->pluck('product');

        return ProductResource::collection($favorites);
    }

    public function toggle(Request $request, Product $product): JsonResponse
    {
        $favorite = $request->user()->favorites()->where('product_id', $product->id)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Retiré des favoris.', 'is_favorite' => false]);
        }

        $request->user()->favorites()->create(['product_id' => $product->id]);
        return response()->json(['message' => 'Ajouté aux favoris.', 'is_favorite' => true], 201);
    }
}
