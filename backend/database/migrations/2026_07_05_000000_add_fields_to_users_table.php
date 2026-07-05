<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_whatsapp', 30)->nullable()->after('email');
            $table->string('role')->default('visitor')->after('password');
            $table->string('avatar')->nullable()->after('role');
            $table->string('city', 100)->nullable()->after('avatar');
            $table->boolean('is_verified')->default(false)->after('city');
            $table->decimal('rating', 2, 1)->default(0)->after('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone_whatsapp', 'role', 'avatar', 'city', 'is_verified', 'rating']);
        });
    }
};
