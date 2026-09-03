import { Injectable, inject } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Budget, BudgetInsert } from '../models/budget.model';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private auth = inject(AuthService);

  async getAll(): Promise<Budget[]> {
    try {
      await this.auth.waitUntilReady();
      const { data, error } = await supabase
        .from('budgets')
        .select('*, transactions(amount)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('BudgetsService.getAll with transactions join failed, falling back:', error.message);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('budgets')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('BudgetsService.getAll fallback error:', fallbackError);
          return [];
        }

        return (fallbackData ?? []).map((b: any) => ({
          ...b,
          spent: 0
        }));
      }

      return (data ?? []).map((b: any) => ({
        ...b,
        spent: (b.transactions ?? []).reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0)
      }));
    } catch (err) {
      console.error('BudgetsService.getAll exception:', err);
      return [];
    }
  }

  async getById(id: string): Promise<Budget> {
    await this.auth.waitUntilReady();
    const { data, error } = await supabase
      .from('budgets')
      .select('*, transactions(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const spent = (data.transactions ?? []).reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
    return { ...data, spent };
  }

  async create(payload: BudgetInsert): Promise<Budget> {
    await this.auth.waitUntilReady();
    let userId = this.auth.currentUser()?.id;
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData?.user?.id;
    }

    if (!userId) {
      throw new Error('Utilisateur non connecté');
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...payload, user_id: userId })
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

