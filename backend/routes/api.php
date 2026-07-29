<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ContactLogController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReviewController;
use Illuminate\Support\Facades\Api\V1\Route;

/*
API Routes — v1
*/

Route::prefix('v1')->group(function () {

    /*
       Auth (publiques)
        */
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);

    /* 
       Publiques (pas d'auth)
       */
    Route::get('/products',             [ProductController::class, 'index']);
    Route::get('/products/{id}',         [ProductController::class, 'show']);
    Route::get('/products/{id}/similar', [ProductController::class, 'similar']);
    Route::get('/categories',           [CategoryController::class, 'index']);
    Route::get('/categories/{slug}',     [CategoryController::class, 'show']);

    /* 
       Protégées (auth:sanctum)
        */
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',       [AuthController::class, 'me']);

        // Produits (création, upload)
        Route::post('/products',             [ProductController::class, 'store']);
        Route::post('/products/{id}/images', [ProductController::class, 'uploadImage']);

        // Favoris
        Route::get('/favorites',              [FavoriteController::class, 'index']);
        Route::post('/favorites/{productId}', [FavoriteController::class, 'toggle']);

        // Avis
        Route::post('/reviews', [ReviewController::class, 'store']);

        // Contact WhatsApp
        Route::post('/contacts', [ContactLogController::class, 'store']);
    });
});
