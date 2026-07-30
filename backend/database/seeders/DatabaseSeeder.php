<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(10)->create();

        $this->call(CategorySeeder::class);

        // Génère 3 produits pour CHAQUE sous-catégorie, avec un titre cohérent
        Category::whereNotNull('parent_id')->get()->each(function (Category $category) {
            Product::factory(3)->forCategory($category)->create()->each(function (Product $product) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => 'https://picsum.photos/seed/'.$product->id.'/600/800',
                    'position' => 0,
                ]);
            });
        });
    }
}