import { Clock, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import masalaPeanutsImage from "@/assets/masala-peanuts.jpg";
import thaiPeanutSaladImage from "@/assets/thai-peanut-salad.jpg";

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

interface RecipeCardProps {
  recipe: Recipe;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-difficulty-easy text-white';
    case 'Semi':
      return 'bg-difficulty-medium text-white';
    case 'Hard':
      return 'bg-difficulty-hard text-white';
    default:
      return 'bg-secondary';
  }
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleStartCooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/recipe/${recipe.id}/guided`);
  };

  return (
    <Card className="recipe-card group cursor-pointer" onClick={handleCardClick}>
      <div className="relative">
        {/* Recipe Image */}
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/20 rounded-t-lg relative overflow-hidden">
          {/* Actual recipe images */}
          {recipe.id === "1" && (
            <img src={masalaPeanutsImage} alt={recipe.title} className="w-full h-full object-cover" />
          )}
          {recipe.id === "2" && (
            <img src={thaiPeanutSaladImage} alt={recipe.title} className="w-full h-full object-cover" />
          )}
          {!["1", "2"].includes(recipe.id) && (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
              <span className="text-4xl">{recipe.category === "Snacks" ? "🍿" : recipe.category === "Healthy" ? "🥗" : "🍛"}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Time Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {recipe.cookingTime} min{recipe.cookingTime !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background"
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Tags */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-primary/90 text-primary-foreground backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Recipe Title & Description */}
          <div className="mb-3">
            <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          </div>

          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recipe.servings}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{recipe.calories} kcal</span>
              </div>
            </div>
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full gradient-hero text-primary-foreground font-medium"
            size="sm"
            onClick={handleStartCooking}
          >
            Start Cooking
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default RecipeCard;