import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { differenceInDays, differenceInWeeks, differenceInMonths, startOfDay } from 'date-fns';

export function useRecurringContributions(onContributionMade?: () => void) {
  const { user } = useAuth();

  const processRecurringContributions = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch goals with recurring contributions enabled
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .neq('recurring_frequency', 'none')
        .gt('recurring_amount', 0);

      if (error) throw error;
      if (!goals || goals.length === 0) return;

      const today = startOfDay(new Date());

      for (const goal of goals) {
        const lastContribution = goal.last_contribution_date 
          ? startOfDay(new Date(goal.last_contribution_date))
          : null;

        let shouldContribute = false;

        if (!lastContribution) {
          shouldContribute = true;
        } else {
          switch (goal.recurring_frequency) {
            case 'daily':
              shouldContribute = differenceInDays(today, lastContribution) >= 1;
              break;
            case 'weekly':
              shouldContribute = differenceInWeeks(today, lastContribution) >= 1;
              break;
            case 'monthly':
              shouldContribute = differenceInMonths(today, lastContribution) >= 1;
              break;
          }
        }

        if (shouldContribute) {
          const newAmount = Math.min(
            goal.current_amount + goal.recurring_amount,
            goal.target_amount
          );
          const isCompleted = newAmount >= goal.target_amount;

          // Update goal with new amount
          await supabase
            .from('goals')
            .update({
              current_amount: newAmount,
              last_contribution_date: today.toISOString().split('T')[0],
              is_completed: isCompleted
            })
            .eq('id', goal.id);

          // Record the contribution
          await supabase
            .from('goal_contributions')
            .insert({
              goal_id: goal.id,
              user_id: user.id,
              amount: goal.recurring_amount,
              contribution_date: today.toISOString().split('T')[0],
              is_recurring: true,
              notes: `Auto-contribution (${goal.recurring_frequency})`
            });
        }
      }

      onContributionMade?.();
    } catch (error) {
      console.error('Error processing recurring contributions:', error);
    }
  }, [user, onContributionMade]);

  useEffect(() => {
    // Process on mount
    processRecurringContributions();
  }, [processRecurringContributions]);

  return { processRecurringContributions };
}
