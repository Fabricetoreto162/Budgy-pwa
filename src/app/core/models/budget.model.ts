export interface Budget {
    id: string;
    user_id: string;
    name: string;
    amount: number;       // plafond
    spent: number;         // calculé (somme des transactions liées)
    icon: string;
    color: string;
    created_at: string;
  }
  
  export interface BudgetInsert {
    name: string;
    amount: number;
    icon: string;
    color: string;
  }