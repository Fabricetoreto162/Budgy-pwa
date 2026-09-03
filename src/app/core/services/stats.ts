import { Injectable } from '@angular/core';
import { BudgetsService } from './budgets';
import { TransactionsService } from './transactions';

export interface DashboardStats {
  totalSpent: number;
  transactionCount: number;
  budgetsReached: number;
  budgetsTotal: number;
  byCategory: { label: string; value: number; color: string }[];
  monthlyEvolution: { month: string; value: number }[];
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(
    private budgetsSvc: BudgetsService,
    private txSvc: TransactionsService
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const budgets = await this.budgetsSvc.getAll();
    const transactions = await this.txSvc.getRecent(180);

    const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
    const budgetsReached = budgets.filter(b => b.spent >= b.amount).length;

    const byCategoryMap = new Map<string, number>();
    for (const b of budgets) {
      byCategoryMap.set(b.name, (byCategoryMap.get(b.name) ?? 0) + b.spent);
    }
    const byCategory = budgets.map(b => ({
      label: b.name,
      value: b.spent,
      color: b.color
    }));

    const monthMap = new Map<string, number>();
    for (const t of transactions) {
      const month = new Date(t.created_at).toLocaleDateString('fr-FR', { month: 'short' });
      monthMap.set(month, (monthMap.get(month) ?? 0) + t.amount);
    }
    const monthlyEvolution = Array.from(monthMap.entries()).map(([month, value]) => ({ month, value }));

    return {
      totalSpent,
      transactionCount: transactions.length,
      budgetsReached,
      budgetsTotal: budgets.length,
      byCategory,
      monthlyEvolution
    };
  }
}