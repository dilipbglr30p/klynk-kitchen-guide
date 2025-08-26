import { useState } from "react";
import RecipeCard from "./RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Semi' | 'Hard';
  category: string;
  tags: string[];
  image: string;
  calories: number;
}

interface RecipeGridProps {
  searchQuery: string;
  filters: {
    category: string;
    cookingTime: string;
    mealType: string;
  };
}

// Sample recipe data inspired by the images
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Masala Peanuts",
    description: "Crunchy spiced peanuts perfect for snacking",
    cookingTime: 1,
    servings: 4,
    difficulty: "Easy",
    category: "Snacks",
    tags: ["Vegan", "Indian", "Chaat"],
    image: "/api/placeholder/300/200",
    calories: 150
  },
  {
    id: "2", 
    title: "Thai Peanut Salad",
    description: "Fresh and zesty Thai-style peanut salad",
    cookingTime: 4,
    servings: 2,
    difficulty: "Easy",
    category: "Healthy",
    tags: ["Veg", "Thai"],
    image: "/api/placeholder/300/200",
    calories: 280
  },
  {
    id: "3",
    title: "Peanut Mushroom Spread",
    description: "Creamy mushroom and peanut spread",
    cookingTime: 16,
    servings: 4,
    difficulty: "Semi",
    category: "Snacks",
    tags: ["Vegan", "Fusion"],
    image: "/api/placeholder/300/200",
    calories: 220
  },
  {
    id: "4",
    title: "Tomato Peanut Chutney",
    description: "South Indian style tomato peanut chutney",
    cookingTime: 22,
    servings: 6,
    difficulty: "Semi",
    category: "South Indian",
    tags: ["Vegan", "Indian", "South Indian", "Andhra"],
    image: "/api/placeholder/300/200",
    calories: 180
  },
  {
    id: "5",
    title: "Wai Wai Bhel",
    description: "Street food style bhel with instant noodles",
    cookingTime: 1,
    servings: 2,
    difficulty: "Easy",
    category: "Snacks",
    tags: ["Vegan", "Street food"],
    image: "/api/placeholder/300/200",
    calories: 320
  },
  {
    id: "6",
    title: "Bhel Puri",
    description: "Classic Mumbai street food snack",
    cookingTime: 1,
    servings: 2,
    difficulty: "Easy",
    category: "Snacks",
    tags: ["Vegan", "Indian", "Chaat"],
    image: "/api/placeholder/300/200",
    calories: 250
  },
  {
    id: "7",
    title: "Masala Papad Taco",
    description: "Fusion taco with Indian flavors",
    cookingTime: 1,
    servings: 1,
    difficulty: "Easy",
    category: "Snacks",
    tags: ["Vegan", "Mexican"],
    image: "/api/placeholder/300/200",
    calories: 180
  },
  {
    id: "8",
    title: "Bruschetta",
    description: "Italian style toasted bread with toppings",
    cookingTime: 6,
    servings: 4,
    difficulty: "Easy",
    category: "Snacks",
    tags: ["Vegan", "Italian"],
    image: "/api/placeholder/300/200",
    calories: 160
  }
];

const RecipeGrid = ({ searchQuery, filters }: RecipeGridProps) => {
  const [recipes] = useState<Recipe[]>(sampleRecipes);

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    // Search query filter
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (filters.category !== "All" && recipe.category !== filters.category) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Section Headers */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {filters.category === "All" ? "Popular Recipes" : filters.category}
        </h2>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recipes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;