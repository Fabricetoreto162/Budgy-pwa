import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Transaction, TransactionInsert } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  async getRecent(days = 30): Promise<Transaction[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('transactions')
      .select('*, budgets(name, icon, color)')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getByBudget(budgetId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('budget_id', budgetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async create(payload: TransactionInsert): Promise<Transaction> {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: userData.user!.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
  }
}