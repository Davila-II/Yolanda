<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'username', 'email', 'password', 'whatsapp_phone', 'city', 'avatar_url', 'bio', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $appends = ['avatar', 'whatsapp', 'role'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* 
       Relations
        */

    /**
     * Les produits publiés par cet utilisateur (en tant que vendeur).
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    /**
     * Les favoris de l'utilisateur.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Les avis laissés par cet utilisateur.
     */
    public function writtenReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Les avis reçus par cet utilisateur (en tant que vendeur).
     */
    public function receivedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'seller_id');
    }

    /**
     * L'historique des contacts WhatsApp initiés par cet utilisateur.
     */
    public function contactsLog(): HasMany
    {
        return $this->hasMany(ContactLog::class);
    }

    /**
     * Les signalements faits par cet utilisateur.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    /* 
       Accesseurs compatibilité frontend
        */

    public function getAvatarAttribute(): ?string
    {
        return $this->avatar_url;
    }

    public function getWhatsappAttribute(): ?string
    {
        return $this->whatsapp_phone;
    }

    public function getRoleAttribute(): string
    {
        return $this->hasRole('admin') ? 'admin' : 'user';
    }
}
