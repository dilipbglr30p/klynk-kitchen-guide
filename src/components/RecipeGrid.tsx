import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import RecipeCard from "./RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
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

const RecipeGrid = ({ searchQuery, filters }: RecipeGridProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        
        // Fetch recipes with tags
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('id, title, description, cooking_time, servings, difficulty, category, image, calories');

        if (recipesError) throw recipesError;

        // Fetch tags for all recipes
        const { data: tagsData, error: tagsError } = await supabase
          .from('recipe_tags')
          .select('recipe_id, tag');

        if (tagsError) throw tagsError;

        // Group tags by recipe_id
        const tagsByRecipe: { [key: string]: string[] } = {};
        tagsData?.forEach(tag => {
          if (!tagsByRecipe[tag.recipe_id]) {
            tagsByRecipe[tag.recipe_id] = [];
          }
          tagsByRecipe[tag.recipe_id].push(tag.tag);
        });

        // Combine recipes with their tags
        const recipesWithTags = recipesData?.map(recipe => ({
          ...recipe,
          tags: tagsByRecipe[recipe.id] || [],
          difficulty: recipe.difficulty as 'Easy' | 'Semi' | 'Hard'
        })) || [];

        setRecipes(recipesWithTags);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    // Search query filter
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (filters.category !== "All" && recipe.category !== filters.category) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading recipes...</p>
      </div>
    );
  }

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
          <RecipeCard key={recipe.id} recipe={{
            ...recipe,
            cookingTime: recipe.cooking_time
          }} />
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