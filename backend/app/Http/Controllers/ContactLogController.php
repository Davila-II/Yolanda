<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactLogController extends Controller
{
    /**
     * Enregistre un contact WhatsApp initié par l'utilisateur.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::published()->findOrFail($validated['product_id']);
        $user = $request->user();

        $log = $user->contactsLog()->create([
            'product_id' => $product->id,
        ]);

        return response()->json([
            'message'   => 'Contact enregistré.',
            'whatsapp'  => $product->seller->whatsapp_phone
                ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $product->seller->whatsapp_phone)
                : null,
            'data'      => $log,
        ], 201);
    }
}
