import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users, Heart, Play, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import IngredientsList from "./IngredientsList";
import ServingsSelector from "./ServingsSelector";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  group_type: 'PREP' | 'COLLECT';
  note?: string;
  icon?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  servings: number;
  difficulty: string;
  calories: number;
  image: string;
  tags: string[];
}

const RecipeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [servings, setServings] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (recipeError) throw recipeError;

        // Fetch recipe tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('recipe_tags')
          .select('tag')
          .eq('recipe_id', id);

        if (tagsError) throw tagsError;

        // Fetch recipe ingredients with ingredient names
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(`
            id,
            quantity,
            unit,
            group_type,
            note,
            icon,
            ingredients (name)
          `)
          .eq('recipe_id', id);

        if (ingredientsError) throw ingredientsError;

        const formattedIngredients = ingredientsData?.map(item => ({
          id: item.id,
          name: (item.ingredients as any)?.name || '',
          quantity: Number(item.quantity),
          unit: item.unit || '',
          group_type: item.group_type as 'PREP' | 'COLLECT',
          note: item.note,
          icon: item.icon
        })) || [];

        setRecipe({
          ...recipeData,
          tags: tagsData?.map(t => t.tag) || []
        });
        setIngredients(formattedIngredients);
        setServings(recipeData.servings);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleStartGuided = () => {
    navigate(`/recipe/${id}/guided`);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Recipe not found.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{recipe.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? "text-red-500" : ""}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <div className="text-xl">⋮</div>
          </Button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="mb-6">
        <div className="aspect-video rounded-lg overflow-hidden mb-4">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{servings}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time} m</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{recipe.calories} kcal</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          {recipe.description}
        </p>
      </div>

      {/* Servings Selector */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Servings</CardTitle>
        </CardHeader>
        <CardContent>
          <ServingsSelector 
            value={servings} 
            onChange={setServings} 
          />
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientsList 
            ingredients={ingredients}
            baseServings={recipe.servings}
            currentServings={servings}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="sticky bottom-4 bg-background/80 backdrop-blur-md rounded-lg p-4 border">
        <div className="flex gap-3">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">COOK ON</p>
            <p>Manual | Guided ▲</p>
          </div>
          <Button className="flex-1 gradient-hero text-primary-foreground font-medium h-12" onClick={handleStartGuided}>
            <Play className="w-4 h-4 mr-2" />
            Start Prepping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;