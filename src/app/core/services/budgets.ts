import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Budget, BudgetInsert } from '../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetsService {

  async getAll(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*, transactions(amount)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((b: any) => ({
      ...b,
      spent: (b.transactions ?? []).reduce((sum: number, t: any) => sum + t.amount, 0)
    }));
  }

  async getById(id: string): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*, transactions(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const spent = (data.transactions ?? []).reduce((sum: number, t: any) => sum + t.amount, 0);
    return { ...data, spent };
  }

  async create(payload: BudgetInsert): Promise<Budget> {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...payload, user_id: userData.user!.id })
      .select()
      .single();

    if (error) throw error;
    return { ...data, spent: 0 };
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) throw error;
  }
}
