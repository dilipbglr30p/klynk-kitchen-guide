import { useState } from "react";
import { ArrowLeft, Clock, Users, Heart, Play, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import IngredientsList from "./IngredientsList";
import ServingsSelector from "./ServingsSelector";
import masalaPeanutsImage from "@/assets/masala-peanuts.jpg";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  group_type: 'PREP' | 'COLLECT';
  note?: string;
  icon?: string;
}

const sampleIngredients: Ingredient[] = [
  { id: 1, name: "Rasam Powder", quantity: 1, unit: "tbsp", group_type: "COLLECT", icon: "🌶️" },
  { id: 2, name: "Curry Leaves", quantity: 1, unit: "sprig", group_type: "COLLECT", icon: "🌿" },
  { id: 3, name: "Red Chilli Powder", quantity: 1, unit: "tsp", group_type: "COLLECT", icon: "🌶️" },
  { id: 4, name: "Green Chilli", quantity: 1, unit: "piece", group_type: "PREP", note: "Slit lengthwise", icon: "🌶️" },
  { id: 5, name: "Rice", quantity: 2, unit: "cup", group_type: "PREP", note: "Cooked", icon: "🍚" },
  { id: 6, name: "Coriander Leaves", quantity: 1, unit: "tbsp", group_type: "COLLECT", icon: "🌿" },
  { id: 7, name: "Chilli Oil", quantity: 1, unit: "tbsp", group_type: "COLLECT", icon: "🫗" },
  { id: 8, name: "Cumin Seed", quantity: 1, unit: "tsp", group_type: "COLLECT", icon: "🟫" },
  { id: 9, name: "Turmeric Powder", quantity: 0.5, unit: "tsp", group_type: "COLLECT", icon: "🟡" },
  { id: 10, name: "Salt", quantity: 0.5, unit: "tsp", group_type: "COLLECT", icon: "🧂" },
  { id: 11, name: "Tomato", quantity: 1, unit: "large", group_type: "PREP", note: "Finely chopped", icon: "🍅" },
  { id: 12, name: "Mustard Seeds", quantity: 1, unit: "tsp", group_type: "COLLECT", icon: "⚫" }
];

const RecipeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servings, setServings] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleStartGuided = () => {
    navigate(`/recipe/${id}/guided`);
  };
  
  const recipe = {
    id: "1",
    title: "Masala Peanuts",
    description: "Crunchy spiced peanuts perfect for snacking with South Indian flavors",
    cookingTime: 20,
    baseServings: 4,
    difficulty: "Semi" as const,
    calories: 478,
    image: masalaPeanutsImage,
    tags: ["Vegan", "Indian", "South Indian", "Chaat"]
  };

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
              <span>{recipe.cookingTime} m</span>
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
            ingredients={sampleIngredients}
            baseServings={recipe.baseServings}
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