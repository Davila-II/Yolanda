<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Créer un avis sur un produit/vendeur.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $user = $request->user();

        // Un utilisateur ne peut pas s'évaluer lui-même
        if ($product->seller_id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas évaluer votre propre produit.',
            ], 422);
        }

        // Vérifie si l'utilisateur a déjà laissé un avis sur ce produit
        $existing = $user->writtenReviews()
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà laissé un avis sur ce produit.',
            ], 422);
        }

        $review = $user->writtenReviews()->create([
            'product_id' => $validated['product_id'],
            'seller_id'  => $product->seller_id,
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'] ?? null,
        ]);

        return response()->json(['data' => $review], 201);
    }
}
