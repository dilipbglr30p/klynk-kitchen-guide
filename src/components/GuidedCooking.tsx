import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Step {
  id: number;
  step_number: number;
  instruction: string;
  duration: number;
}

interface Recipe {
  title: string;
}

const GuidedCooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchRecipeAndSteps = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('title')
          .eq('id', id)
          .single();

        if (recipeError) throw recipeError;

        // Fetch recipe steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('recipe_steps')
          .select('*')
          .eq('recipe_id', id)
          .order('step_number');

        if (stepsError) throw stepsError;

        setRecipe(recipeData);
        setSteps(stepsData || []);
        
        if (stepsData && stepsData.length > 0) {
          setTimeRemaining(stepsData[0].duration);
        }
      } catch (error) {
        console.error('Error fetching recipe steps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndSteps();
  }, [id]);

  const step = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // Timer logic
  useEffect(() => {
    if (step?.duration) {
      setTimeRemaining(step.duration);
    } else {
      setTimeRemaining(null);
    }
    setTimerActive(false);
  }, [currentStep, step?.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            setTimerActive(false);
            // Auto-advance to next step when timer completes
            if (currentStep < steps.length - 1) {
              setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
            }
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, currentStep, steps.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlayPause = () => {
    if (step?.duration && timeRemaining) {
      setTimerActive(!timerActive);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetTimer = () => {
    if (step?.duration) {
      setTimeRemaining(step.duration);
      setTimerActive(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen bg-background">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading guided cooking...</p>
        </div>
      </div>
    );
  }

  if (!recipe || steps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen bg-background">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cooking steps found for this recipe.</p>
          <Button onClick={() => navigate(`/recipe/${id}`)} className="mt-4">
            Back to Recipe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-md border-b p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/recipe/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <div className="text-sm font-medium">{currentStep + 1}</div>
            <div className="text-xs text-muted-foreground">{steps.length}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{Math.round(progress)}%</div>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <div className="text-lg">⋮</div>
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Main Content */}
      <div className="p-4 pb-32">
        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 leading-relaxed">
              {step.instruction}
            </h2>

            {/* Timer Section */}
            {step.duration > 0 && timeRemaining !== null && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-timer-active/20 to-primary/20 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2 gradient-timer bg-clip-text text-transparent">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayPause}
                      className="px-4"
                    >
                      {timerActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {timerActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetTimer}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  {timeRemaining === 0 && (
                    <div className="mt-3 text-green-600 font-medium">
                      ✅ Timer Complete!
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="h-12"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={() => speak(step.instruction)}
            className="h-12"
          >
            🔊 Repeat
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={currentStep === steps.length - 1}
            className="h-12 gradient-hero text-primary-foreground"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-colors ${
                index <= currentStep 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      {currentStep === steps.length - 1 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <Button className="w-full h-12 gradient-hero text-primary-foreground font-medium">
            🎉 Recipe Complete! Rate Your Cooking
          </Button>
        </div>
      )}
    </div>
  );
};

export default GuidedCooking;