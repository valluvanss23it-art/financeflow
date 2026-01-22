-- Add recurring contribution fields to goals table
ALTER TABLE public.goals
ADD COLUMN recurring_amount NUMERIC DEFAULT 0,
ADD COLUMN recurring_frequency TEXT DEFAULT 'none' CHECK (recurring_frequency IN ('none', 'daily', 'weekly', 'monthly')),
ADD COLUMN last_contribution_date DATE;

-- Create goal contributions history table
CREATE TABLE public.goal_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies for goal_contributions
CREATE POLICY "Users can view their own goal contributions"
ON public.goal_contributions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goal contributions"
ON public.goal_contributions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal contributions"
ON public.goal_contributions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_goal_contributions_goal_id ON public.goal_contributions(goal_id);
CREATE INDEX idx_goal_contributions_user_id ON public.goal_contributions(user_id);