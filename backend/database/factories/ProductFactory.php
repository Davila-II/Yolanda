<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $price = $this->faker->numberBetween(3000, 60000);

        return [
            'title' => ucfirst($this->faker->words(3, true)),
            'description' => $this->faker->paragraph(),
            'price' => $price,
            'original_price' => $price * $this->faker->randomFloat(1, 1.3, 2.5),
            'condition' => $this->faker->randomElement([
                'new_with_tag', 'like_new', 'very_good', 'good', 'satisfactory',
            ]),
            'size' => $this->faker->randomElement(['XS', 'S', 'M', 'L', 'XL', null]),
            'brand' => $this->faker->randomElement(['Zara', 'Nike', 'H&M', 'Mango', null]),
            'color' => $this->faker->safeColorName(),
            'status' => 'published',
            'category_id' => Category::whereNotNull('parent_id')->inRandomOrder()->first()?->id,
            'seller_id' => User::inRandomOrder()->first()?->id,
        ];
    }
}