<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Signaler un produit.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'reason'     => 'required|string|max:255',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $user = $request->user();

        // Empêche un utilisateur de signaler deux fois le même produit
        $existing = $user->reports()
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà signalé ce produit.',
            ], 422);
        }

        $report = $user->reports()->create([
            'product_id' => $product->id,
            'reason'     => $validated['reason'],
            'status'     => 'pending',
        ]);

        return response()->json(['data' => $report], 201);
    }
}