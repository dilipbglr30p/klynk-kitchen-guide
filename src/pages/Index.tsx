import { useState } from "react";
import RecipeGrid from "../components/RecipeGrid";
import RecipeFilters from "../components/RecipeFilters";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "All",
    cookingTime: "",
    mealType: ""
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent">
                  Klynk Kitchen
                </h1>
                <p className="text-sm text-muted-foreground">
                  Now, everyone can cook everything!
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-4 py-2 min-w-80">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <RecipeFilters 
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        
        {/* Recipe Grid */}
        <RecipeGrid 
          searchQuery={searchQuery}
          filters={selectedFilters}
        />
      </div>
    </div>
  );
};

export default Index;