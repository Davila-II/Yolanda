<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Titres réalistes par slug de catégorie (catégories "feuilles" uniquement).
     */
    protected static array $catalog = [
        'femmes-robes' => ['Robe midi fleurie printemps', 'Robe africaine wax brodée', 'Robe longue satinée', 'Robe patineuse à pois', 'Robe portefeuille en lin'],
        'femmes-tops-t-shirts' => ['Top côtelé sans manches', 'T-shirt oversized imprimé', 'Débardeur en lin', 'Crop top en maille'],
        'femmes-jeans' => ['Jean mom taille haute', 'Jean skinny délavé', 'Jean droit brut', 'Jean bootcut taille haute'],
        'femmes-chaussures' => ['Escarpins vernis noirs', 'Sandales à talon compensé', 'Ballerines en cuir souple', 'Mocassins à franges'],
        'hommes-chemises' => ['Chemise oxford à rayures', 'Chemise en lin manches courtes', 'Chemise à carreaux flanelle'],
        'hommes-pantalons' => ['Pantalon chino slim', 'Pantalon de costume gris', 'Jogger en toile'],
        'hommes-vestes' => ['Veste en cuir camel vintage', 'Blazer oversized crème', 'Doudoune sans manches', 'Costume homme 2 pièces marine'],
        'hommes-chaussures' => ['Mocassins en daim', 'Derbies cuir marron', 'Baskets basses blanches'],
        'enfants-filles' => ['Robe à volants enfant', 'Jupe tutu rose', 'Legging imprimé licorne'],
        'enfants-garcons' => ['T-shirt dinosaure enfant', 'Short cargo garçon', 'Pull à capuche enfant'],
        'enfants-bebe' => ['Body coton bébé', 'Pyjama pilou bébé', 'Ensemble naissance'],
        'chaussures-baskets' => ['Sneakers blanches minimalistes', 'Baskets running respirantes', 'Baskets montantes rétro'],
        'chaussures-sandales' => ['Sandales plates en cuir', 'Claquettes de plage', 'Nu-pieds à brides'],
        'chaussures-bottes' => ['Bottines chelsea', 'Bottes de pluie', 'Bottes cavalières'],
        'sacs-accessoires-sacs-a-main' => ['Sac à main en osier naturel', 'Sac bandoulière matelassé', 'Cabas en toile'],
        'sacs-accessoires-ceintures' => ['Ceinture en cuir tressé', 'Ceinture à boucle dorée'],
        'sacs-accessoires-bijoux' => ['Collier fin plaqué or', 'Bracelet jonc argenté', "Boucles d'oreilles créoles", 'Montre homme analogique acier'],
        'beaute-soins-visage' => ['Crème hydratante visage', 'Sérum vitamine C', 'Masque argile purifiant'],
        'beaute-maquillage' => ['Palette fards à paupières', 'Rouge à lèvres mat', 'Fond de teint longue tenue'],
    ];

    /**
     * Type de taille à utiliser selon la catégorie.
     */
    protected static array $sizeTypeByCategory = [
        'femmes-robes' => 'clothing', 'femmes-tops-t-shirts' => 'clothing', 'femmes-jeans' => 'clothing',
        'hommes-chemises' => 'clothing', 'hommes-pantalons' => 'clothing', 'hommes-vestes' => 'clothing',
        'enfants-filles' => 'clothing', 'enfants-garcons' => 'clothing', 'enfants-bebe' => 'clothing',
        'femmes-chaussures' => 'shoes', 'hommes-chaussures' => 'shoes',
        'chaussures-baskets' => 'shoes', 'chaussures-sandales' => 'shoes', 'chaussures-bottes' => 'shoes',
        'sacs-accessoires-sacs-a-main' => 'unique', 'sacs-accessoires-ceintures' => 'unique', 'sacs-accessoires-bijoux' => 'unique',
        'beaute-soins-visage' => 'none', 'beaute-maquillage' => 'none',
    ];

    protected static array $sizePools = [
        'clothing' => ['XS', 'S', 'M', 'L', 'XL'],
        'shoes' => ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
        'unique' => ['Taille Unique'],
        'none' => [],
    ];

    /**
     * Définition par défaut (fallback, catégorie assignée au hasard si on n'utilise pas forCategory()).
     */
    public function definition(): array
    {
        $category = Category::whereNotNull('parent_id')->inRandomOrder()->first();

        return $this->baseAttributes($category);
    }

    /**
     * État dédié : génère un produit cohérent avec une catégorie donnée.
     */
    public function forCategory(Category $category): static
    {
        return $this->state(fn () => $this->baseAttributes($category));
    }

    protected function baseAttributes(?Category $category): array
    {
        $price = $this->faker->numberBetween(3000, 60000);
        $slug = $category?->slug;
        $titles = self::$catalog[$slug] ?? [$category?->name ?? 'Article'];
        $sizeType = self::$sizeTypeByCategory[$slug] ?? 'clothing';
        $sizePool = self::$sizePools[$sizeType];

        return [
            'title' => $this->faker->randomElement($titles),
            'description' => $this->faker->paragraph(),
            'price' => $price,
            'original_price' => $price * $this->faker->randomFloat(1, 1.3, 2.5),
            'condition' => $this->faker->randomElement([
                'new_with_tag', 'like_new', 'very_good', 'good', 'satisfactory',
            ]),
            'size' => $sizePool ? $this->faker->randomElement($sizePool) : null,
            'brand' => $this->faker->randomElement(['Zara', 'Nike', 'H&M', 'Mango', "Levi's", 'Sézane', 'Arket', null]),
            'color' => $this->faker->safeColorName(),
            'status' => 'published',
            'category_id' => $category?->id,
            'seller_id' => User::inRandomOrder()->first()?->id,
        ];
    }
}