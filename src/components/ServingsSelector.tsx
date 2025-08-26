import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ServingsSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const ServingsSelector = ({ value, onChange }: ServingsSelectorProps) => {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= 1}
        className="h-10 w-10 rounded-full"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="flex flex-col items-center min-w-16">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">servings</span>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        className="h-10 w-10 rounded-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ServingsSelector;