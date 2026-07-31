<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@yolanda.cm'],
            [
                'name'     => 'Admin Yolanda',
                'username' => 'admin',
                'password' => Hash::make('admin'),
                'city'     => 'Douala',
            ]
        );
        $admin->assignRole($adminRole);

        $testUser = User::firstOrCreate(
            ['email' => 'test@yolanda.cm'],
            [
                'name'           => 'Marie Kamga',
                'username'       => 'mariekamga',
                'password'       => Hash::make('password'),
                'whatsapp_phone' => '+237 6 00 00 00 00',
                'city'           => 'Douala',
                'bio'            => 'Passionnée de mode circulaire et de durabilité.',
            ]
        );
        $testUser->assignRole($userRole);

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