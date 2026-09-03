export function formatFCFA(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
  }
  
  export function percentSpent(spent: number, amount: number): number {
    if (amount <= 0) return 0;
    return Math.min(100, Math.round((spent / amount) * 100));
  }