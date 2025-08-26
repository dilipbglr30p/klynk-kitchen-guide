import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  group_type: 'PREP' | 'COLLECT';
  note?: string;
  icon?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  baseServings: number;
  currentServings: number;
}

const scaleQuantity = (baseQuantity: number, baseServings: number, currentServings: number): string => {
  const scaled = (baseQuantity * currentServings) / baseServings;
  
  // Handle fractions nicely
  if (scaled < 1) {
    const fraction = scaled.toString();
    if (fraction.includes('0.5')) return '1/2';
    if (fraction.includes('0.25')) return '1/4';
    if (fraction.includes('0.75')) return '3/4';
    if (fraction.includes('0.33')) return '1/3';
    if (fraction.includes('0.66')) return '2/3';
  }
  
  // Return as decimal if needed, otherwise as integer
  return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
};

const IngredientsList = ({ ingredients, baseServings, currentServings }: IngredientsListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const handleCheck = (ingredientId: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const prepIngredients = ingredients.filter(ing => ing.group_type === 'PREP');
  const collectIngredients = ingredients.filter(ing => ing.group_type === 'COLLECT');

  const renderIngredientGroup = (groupIngredients: Ingredient[], title: string) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">
        {groupIngredients.map((ingredient) => {
          const isChecked = checkedItems.has(ingredient.id);
          const scaledQuantity = scaleQuantity(ingredient.quantity, baseServings, currentServings);
          
          return (
            <div key={ingredient.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => handleCheck(ingredient.id)}
                className="shrink-0"
              />
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {ingredient.icon && (
                  <span className="text-2xl shrink-0">{ingredient.icon}</span>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                      {ingredient.name}
                    </span>
                    <span className={`text-sm font-bold ${isChecked ? 'line-through text-muted-foreground' : 'text-primary'}`}>
                      {scaledQuantity} {ingredient.unit}
                    </span>
                  </div>
                  {ingredient.note && (
                    <p className={`text-xs mt-1 ${isChecked ? 'line-through text-muted-foreground' : 'text-orange-600'}`}>
                      {ingredient.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Nutrition Info */}
      <div className="bg-cream-base rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔥</span>
          <span className="font-medium text-sm">Nutrition per serving</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-lg">381</div>
            <div className="text-muted-foreground">Kcal</div>
          </div>
          <div>
            <div className="font-bold text-lg">10g</div>
            <div className="text-muted-foreground">Protein</div>
          </div>
          <div>
            <div className="font-bold text-lg">15g</div>
            <div className="text-muted-foreground">Fats</div>
          </div>
          <div>
            <div className="font-bold text-lg">52g</div>
            <div className="text-muted-foreground">Carbs</div>
          </div>
        </div>
      </div>

      {/* Allergens */}
      <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-3 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️ Allergens: Gluten, Nuts, Sesame</span>
          </div>
          <Button variant="ghost" size="sm" className="h-auto p-1">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Prep Ingredients */}
      {prepIngredients.length > 0 && renderIngredientGroup(prepIngredients, "PREP THESE")}
      
      {/* Collect Ingredients */}
      {collectIngredients.length > 0 && renderIngredientGroup(collectIngredients, "COLLECT THESE")}
    </div>
  );
};

export default IngredientsList;