<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_products_published' => Product::where('status', 'published')->count(),
            'total_products_sold' => Product::where('status', 'sold')->count(),
            'total_reports_pending' => \App\Models\Report::where('status', 'pending')->count(),
        ]);
    }

    public function toggleUserStatus(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'is_verified' => ['required', 'boolean'],
        ]);

        $user->update(['is_verified' => $request->is_verified]);

        return response()->json([
            'message' => $request->is_verified ? 'Utilisateur vérifié.' : 'Utilisateur suspendu.',
            'user' => $user->fresh(),
        ]);
    }
}
