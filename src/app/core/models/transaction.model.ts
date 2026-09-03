export interface Transaction {
    id: string;
    user_id: string;
    budget_id: string;
    amount: number;         // toujours positif, "dépense" par convention
    description: string;
    created_at: string;
  }
  
  export interface TransactionInsert {
    budget_id: string;
    amount: number;
    description: string;
  }