-- Create enum for asset types
CREATE TYPE public.asset_type AS ENUM ('cash', 'bank', 'fd', 'stocks', 'mutual_funds', 'crypto', 'gold', 'property', 'other');

-- Create enum for liability types
CREATE TYPE public.liability_type AS ENUM ('home_loan', 'car_loan', 'personal_loan', 'education_loan', 'credit_card', 'other');

-- Create enum for insurance types
CREATE TYPE public.insurance_type AS ENUM ('health', 'life', 'vehicle', 'property', 'other');

-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type asset_type NOT NULL DEFAULT 'other',
  current_value NUMERIC NOT NULL DEFAULT 0,
  purchase_value NUMERIC,
  purchase_date DATE,
  notes TEXT,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create asset value history for tracking changes
CREATE TABLE public.asset_value_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create liabilities (loans) table
CREATE TABLE public.liabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type liability_type NOT NULL DEFAULT 'other',
  principal_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  tenure_months INTEGER NOT NULL,
  emi_amount NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  outstanding_balance NUMERIC NOT NULL,
  next_emi_date DATE,
  notes TEXT,
  is_paid_off BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create EMI payments history
CREATE TABLE public.emi_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  liability_id UUID NOT NULL REFERENCES public.liabilities(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  principal_component NUMERIC NOT NULL,
  interest_component NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance table
CREATE TABLE public.insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type insurance_type NOT NULL DEFAULT 'other',
  provider TEXT NOT NULL,
  policy_number TEXT,
  coverage_amount NUMERIC NOT NULL,
  premium_amount NUMERIC NOT NULL,
  premium_frequency TEXT NOT NULL DEFAULT 'yearly',
  start_date DATE NOT NULL,
  end_date DATE,
  next_premium_date DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_value_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emi_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance ENABLE ROW LEVEL SECURITY;

-- Assets RLS policies
CREATE POLICY "Users can view their own assets" ON public.assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own assets" ON public.assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assets" ON public.assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assets" ON public.assets FOR DELETE USING (auth.uid() = user_id);

-- Asset value history RLS policies (through asset ownership)
CREATE POLICY "Users can view their asset history" ON public.asset_value_history FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.assets WHERE assets.id = asset_value_history.asset_id AND assets.user_id = auth.uid()));
CREATE POLICY "Users can create their asset history" ON public.asset_value_history FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.assets WHERE assets.id = asset_value_history.asset_id AND assets.user_id = auth.uid()));

-- Liabilities RLS policies
CREATE POLICY "Users can view their own liabilities" ON public.liabilities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own liabilities" ON public.liabilities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own liabilities" ON public.liabilities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own liabilities" ON public.liabilities FOR DELETE USING (auth.uid() = user_id);

-- EMI payments RLS policies (through liability ownership)
CREATE POLICY "Users can view their EMI payments" ON public.emi_payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.liabilities WHERE liabilities.id = emi_payments.liability_id AND liabilities.user_id = auth.uid()));
CREATE POLICY "Users can create their EMI payments" ON public.emi_payments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.liabilities WHERE liabilities.id = emi_payments.liability_id AND liabilities.user_id = auth.uid()));

-- Insurance RLS policies
CREATE POLICY "Users can view their own insurance" ON public.insurance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own insurance" ON public.insurance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insurance" ON public.insurance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own insurance" ON public.insurance FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_liabilities_updated_at BEFORE UPDATE ON public.liabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON public.insurance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();