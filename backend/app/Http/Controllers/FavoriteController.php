<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Liste des favoris de l'utilisateur connecté.
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favorites()
            ->with(['product.category', 'product.seller', 'product.images'])
            ->latest()
            ->paginate(20);

        return response()->json($favorites);
    }

    /**
     * Ajoute ou retire un favori (toggle).
     */
    public function toggle(Request $request, int $productId): JsonResponse
    {
        $product = Product::published()->findOrFail($productId);
        $user = $request->user();

        $existing = $user->favorites()->where('product_id', $productId);

        if ($existing->exists()) {
            $existing->delete();
            return response()->json([
                'message'     => 'Produit retiré des favoris.',
                'is_favorite' => false,
            ]);
        }

        $user->favorites()->create(['product_id' => $productId]);

        return response()->json([
            'message'     => 'Produit ajouté aux favoris.',
            'is_favorite' => true,
        ]);
    }
}
