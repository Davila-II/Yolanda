<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_users'    => User::count(),
                'total_products' => Product::count(),
                'total_reports'  => Report::count(),
            ],
        ]);
    }

    public function reports(): JsonResponse
    {
        $reports = Report::with(['reporter:id,name', 'product:id,title'])
            ->latest()
            ->paginate(20);

        return response()->json(['data' => $reports]);
    }

    public function updateReport(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,resolved,dismissed',
        ]);

        $report = Report::findOrFail($id);
        $report->update(['status' => $validated['status']]);

        return response()->json(['data' => $report]);
    }

    public function updateUserStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,suspended,banned',
        ]);

        $user = User::findOrFail($id);
        $user->update(['status' => $validated['status']]);

        if (in_array($validated['status'], ['banned', 'suspended'])) {
            $user->tokens()->delete();
        }

        return response()->json(['data' => $user]);
    }
}
