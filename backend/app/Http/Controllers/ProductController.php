<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Liste des produits avec filtres, tri et pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'seller', 'images'])
            ->published()
            ->latest();

        // Recherche textuelle
        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        // Filtre par catégorie (slug)
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->input('category'));
            });
        }

        // Filtre par état
        if ($request->filled('condition')) {
            $conditions = explode(',', $request->input('condition'));
            $query->whereIn('condition', $conditions);
        }

        // Filtre par taille
        if ($request->filled('size')) {
            $sizes = explode(',', $request->input('size'));
            $query->whereIn('size', $sizes);
        }

        // Filtre prix max
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Filtre prix min
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        // Tri
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular'    => $query->withCount('favorites')->orderBy('favorites_count', 'desc'),
            default      => $query->latest(),
        };

        $perPage = min((int) $request->input('per_page', 20), 100);
        $products = $query->paginate($perPage);

        // Ajoute is_favorite pour l'utilisateur connecté
        $user = $request->user();
        if ($user) {
            $products->getCollection()->transform(function ($product) use ($user) {
                $product->is_favorite = $product->isFavoritedBy($user);
                return $product;
            });
        }

        return response()->json($products);
    }

    /**
     * Détail d'un produit.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $product = Product::with(['category', 'images', 'reviews'])
            ->published()
            ->findOrFail($id);

        $product->load([
            'seller' => function ($q) {
                $q->withCount(['products', 'receivedReviews'])
                  ->withAvg('receivedReviews', 'rating');
            },
        ]);

        // Ajoute is_favorite
        $product->is_favorite = $product->isFavoritedBy($request->user());

        return response()->json(['data' => $product]);
    }

    /**
     * Produits similaires (même catégorie, exclut le produit courant).
     */
    public function similar(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $similar = Product::with(['category', 'seller', 'images'])
            ->published()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->latest()
            ->limit(8)
            ->get();

        return response()->json(['data' => $similar]);
    }

    /**
     * Créer une annonce.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'condition'      => 'required|string|in:new,like_new,very_good,good,satisfactory',
            'size'           => 'nullable|string|max:50',
            'brand'          => 'nullable|string|max:255',
            'color'          => 'nullable|string|max:100',
            'category_id'    => 'required|exists:categories,id',
        ]);

        $product = $request->user()->products()->create($validated);

        return response()->json(['data' => $product], 201);
    }

    /**
     * Uploader une image pour un produit.
     */
    public function uploadImage(Request $request, int $productId): JsonResponse
    {
        $product = Product::findOrFail($productId);

        // Vérifie que l'utilisateur est le propriétaire
        if ($product->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = $request->file('image')->store('products', 'public');

        $position = $product->images()->count();
        $image = $product->images()->create([
            'url'      => Storage::url($path),
            'position' => $position,
        ]);

        return response()->json(['data' => $image], 201);
    }
}
