-- Create expense categories enum
CREATE TYPE public.expense_category AS ENUM (
  'food',
  'transport',
  'utilities',
  'rent',
  'healthcare',
  'education',
  'entertainment',
  'shopping',
  'insurance',
  'subscriptions',
  'travel',
  'personal_care',
  'household',
  'gifts',
  'investments',
  'taxes',
  'other'
);

-- Create expense table
CREATE TABLE public.expense (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  category expense_category NOT NULL DEFAULT 'other',
  description TEXT,
  merchant TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.expense ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expenses"
ON public.expense FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
ON public.expense FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
ON public.expense FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
ON public.expense FOR DELETE
USING (auth.uid() = user_id);

-- Apply updated_at trigger
CREATE TRIGGER update_expense_updated_at
  BEFORE UPDATE ON public.expense
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX idx_expense_user_id ON public.expense(user_id);
CREATE INDEX idx_expense_date ON public.expense(date DESC);
CREATE INDEX idx_expense_category ON public.expense(category);