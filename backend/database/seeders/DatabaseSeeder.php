<?php

namespace Database\Seeders;

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

        Product::factory(50)->create()->each(function (Product $product) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://picsum.photos/seed/'.$product->id.'/600/800',
                'position' => 0,
            ]);
        });
    }
}