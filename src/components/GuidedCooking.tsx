import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

interface CookingStep {
  id: number;
  instruction: string;
  timerSeconds?: number;
  image?: string;
  tips?: string[];
}

const cookingSteps: CookingStep[] = [
  {
    id: 1,
    instruction: "Pre-heat the pan on medium heat for 1 minute",
    timerSeconds: 60,
    tips: ["Make sure the pan is completely dry", "Medium heat is key - not too high"]
  },
  {
    id: 2,
    instruction: "Add oil, mustard seeds and cumin. Let them splutter for 30 seconds",
    timerSeconds: 30,
    tips: ["Wait for the seeds to crackle", "This releases the flavors"]
  },
  {
    id: 3,
    instruction: "Add curry leaves and green chili. Sauté for 10 seconds",
    timerSeconds: 10,
    tips: ["Be careful of spluttering", "Curry leaves will become crispy"]
  },
  {
    id: 4,
    instruction: "Add chopped tomatoes and cook until soft, about 2-3 minutes",
    timerSeconds: 180,
    tips: ["Tomatoes should become mushy", "Stir occasionally to prevent sticking"]
  },
  {
    id: 5,
    instruction: "Add rasam powder, turmeric, and salt. Mix well",
    timerSeconds: 0,
    tips: ["Ensure spices are evenly distributed", "The mixture should be aromatic"]
  },
  {
    id: 6,
    instruction: "Add the cooked rice and mix gently to combine all ingredients",
    timerSeconds: 0,
    tips: ["Be gentle to avoid breaking rice grains", "Mix until evenly coated"]
  },
  {
    id: 7,
    instruction: "Cook for 2-3 minutes, stirring occasionally",
    timerSeconds: 150,
    tips: ["Rice should absorb the flavors", "Don't overcook to maintain texture"]
  },
  {
    id: 8,
    instruction: "Garnish with fresh coriander leaves and serve hot",
    timerSeconds: 0,
    tips: ["Serve immediately for best taste", "Pair with pickle or yogurt"]
  }
];

const GuidedCooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const step = cookingSteps[currentStep];
  const progress = ((currentStep + 1) / cookingSteps.length) * 100;

  // Timer logic
  useEffect(() => {
    if (step.timerSeconds) {
      setTimeRemaining(step.timerSeconds);
    } else {
      setTimeRemaining(null);
    }
    setTimerActive(false);
  }, [currentStep, step.timerSeconds]);

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
            if (currentStep < cookingSteps.length - 1) {
              setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
            }
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, currentStep]);

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
    if (currentStep < cookingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlayPause = () => {
    if (step.timerSeconds && timeRemaining) {
      setTimerActive(!timerActive);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetTimer = () => {
    if (step.timerSeconds) {
      setTimeRemaining(step.timerSeconds);
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
            <div className="text-xs text-muted-foreground">{cookingSteps.length}</div>
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
            {step.timerSeconds && timeRemaining !== null && (
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

            {/* Tips */}
            {step.tips && step.tips.length > 0 && (
              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-sm">💡 Tips:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
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
            disabled={currentStep === cookingSteps.length - 1}
            className="h-12 gradient-hero text-primary-foreground"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cookingSteps.length}, 1fr)` }}>
          {cookingSteps.map((_, index) => (
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
      {currentStep === cookingSteps.length - 1 && (
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