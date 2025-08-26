-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cooking_time INTEGER NOT NULL, -- in hours
  servings INTEGER NOT NULL DEFAULT 2,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Semi', 'Hard')) DEFAULT 'Easy',
  category TEXT NOT NULL,
  image TEXT,
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ingredients table
CREATE TABLE public.ingredients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe_ingredients junction table
CREATE TABLE public.recipe_ingredients (
  id BIGSERIAL PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id BIGINT NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL NOT NULL,
  unit TEXT,
  group_type TEXT CHECK (group_type IN ('PREP', 'COLLECT')) DEFAULT 'COLLECT',
  note TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe_steps table
CREATE TABLE public.recipe_steps (
  id BIGSERIAL PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, step_number)
);

-- Create recipe_tags junction table
CREATE TABLE public.recipe_tags (
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_tags ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to recipes" 
ON public.recipes FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to ingredients" 
ON public.ingredients FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to recipe_ingredients" 
ON public.recipe_ingredients FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to recipe_steps" 
ON public.recipe_steps FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to recipe_tags" 
ON public.recipe_tags FOR SELECT 
USING (true);

-- Insert sample ingredients
INSERT INTO public.ingredients (name) VALUES
('Peanuts'), ('Masala powder'), ('Oil'), ('Thai basil'), ('Lime'), ('Fish sauce'),
('Mushrooms'), ('Tomatoes'), ('Onions'), ('Garlic'), ('Ginger'), ('Green chilies'),
('Coriander leaves'), ('Mint leaves'), ('Salt'), ('Sugar'), ('Turmeric powder'),
('Red chili powder'), ('Garam masala'), ('Cumin seeds'), ('Mustard seeds'),
('Curry leaves'), ('Coconut'), ('Tamarind'), ('Jaggery');

-- Insert sample recipes with the hardcoded data
INSERT INTO public.recipes (id, title, description, cooking_time, servings, difficulty, category, image, calories) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Masala Peanuts', 'Crunchy spiced peanuts perfect for snacking', 1, 4, 'Easy', 'Snacks', '/api/placeholder/300/200', 150),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Thai Peanut Salad', 'Fresh and zesty Thai-style peanut salad', 4, 2, 'Easy', 'Healthy', '/api/placeholder/300/200', 280),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Peanut Mushroom Spread', 'Creamy mushroom and peanut spread', 16, 4, 'Semi', 'Snacks', '/api/placeholder/300/200', 220),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Tomato Peanut Chutney', 'South Indian style tomato peanut chutney', 22, 6, 'Semi', 'South Indian', '/api/placeholder/300/200', 180),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Wai Wai Bhel', 'Street food style bhel with instant noodles', 1, 2, 'Easy', 'Snacks', '/api/placeholder/300/200', 320),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Bhel Puri', 'Classic Mumbai street food snack', 1, 2, 'Easy', 'Snacks', '/api/placeholder/300/200', 250),
('550e8400-e29b-41d4-a716-446655440007'::uuid, 'Masala Papad Taco', 'Fusion taco with Indian flavors', 1, 1, 'Easy', 'Snacks', '/api/placeholder/300/200', 180),
('550e8400-e29b-41d4-a716-446655440008'::uuid, 'Bruschetta', 'Italian style toasted bread with toppings', 6, 4, 'Easy', 'Snacks', '/api/placeholder/300/200', 160);

-- Insert sample tags
INSERT INTO public.recipe_tags (recipe_id, tag) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Indian'),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Chaat'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Veg'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Thai'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Fusion'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Indian'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'South Indian'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Andhra'),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Street food'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Indian'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Chaat'),
('550e8400-e29b-41d4-a716-446655440007'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440007'::uuid, 'Mexican'),
('550e8400-e29b-41d4-a716-446655440008'::uuid, 'Vegan'),
('550e8400-e29b-41d4-a716-446655440008'::uuid, 'Italian');

-- Insert sample recipe ingredients
INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, quantity, unit, group_type, note) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM ingredients WHERE name = 'Peanuts'), 2, 'cups', 'COLLECT', NULL),
('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM ingredients WHERE name = 'Masala powder'), 1, 'tsp', 'COLLECT', NULL),
('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM ingredients WHERE name = 'Oil'), 1, 'tbsp', 'COLLECT', NULL),
('550e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM ingredients WHERE name = 'Peanuts'), 1, 'cup', 'PREP', 'Roasted'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM ingredients WHERE name = 'Thai basil'), 1, 'bunch', 'PREP', 'Fresh leaves'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM ingredients WHERE name = 'Lime'), 2, 'pieces', 'PREP', 'Juiced');

-- Insert sample recipe steps
INSERT INTO public.recipe_steps (recipe_id, step_number, instruction, duration) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 1, 'Heat oil in a pan over medium heat', 60),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 2, 'Add peanuts and roast for 3-4 minutes until golden', 240),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 3, 'Add masala powder and mix well', 30),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 4, 'Let cool and store in airtight container', 0),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 1, 'Prepare all ingredients by washing and chopping', 300),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 2, 'Mix roasted peanuts with fresh herbs', 120),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 3, 'Add lime juice and toss everything together', 60),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 4, 'Serve fresh and enjoy!', 0);