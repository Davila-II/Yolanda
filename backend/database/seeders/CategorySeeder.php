<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $structure = [
            'Femmes' => ['Robes', 'Tops & T-shirts', 'Jeans', 'Chaussures'],
            'Hommes' => ['Chemises', 'Pantalons', 'Vestes', 'Chaussures'],
            'Enfants' => ['Filles', 'Garçons', 'Bébé'],
            'Chaussures' => ['Baskets', 'Sandales', 'Bottes'],
            'Sacs & Accessoires' => ['Sacs à main', 'Ceintures', 'Bijoux'],
            'Beauté' => ['Soins visage', 'Maquillage'],
        ];

        foreach ($structure as $parentName => $children) {
            $parent = Category::create([
                'name' => $parentName,
                'slug' => str($parentName)->slug(),
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => str($parentName.'-'.$childName)->slug(),
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}