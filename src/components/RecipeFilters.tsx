import { Button } from "@/components/ui/button";

interface FilterCategory {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
}

interface RecipeFiltersProps {
  selectedFilters: {
    category: string;
    cookingTime: string;
    mealType: string;
  };
  onFiltersChange: (filters: any) => void;
}

const categories: FilterCategory[] = [
  { id: "All", name: "All", icon: "🍽️", active: true },
  { id: "Healthy", name: "Healthy", icon: "🥗" },
  { id: "Drinks", name: "Drinks", icon: "🧋" },
  { id: "North Indian", name: "North Indian", icon: "🍛" },
  { id: "South Indian", name: "South Indian", icon: "🥘" },
  { id: "Snacks", name: "Snacks", icon: "🍿" },
];

const RecipeFilters = ({ selectedFilters, onFiltersChange }: RecipeFiltersProps) => {
  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...selectedFilters,
      category: categoryId
    });
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-3">Filter by:</p>
        
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedFilters.category === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
              className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 transition-all hover:scale-105"
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Cuisines</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Cooking Time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Meal Type</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeFilters;