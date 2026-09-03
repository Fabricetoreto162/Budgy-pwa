export interface Profile {
    id: string;           // = auth.uid()
    full_name: string | null;
    avatar_url: string | null;
    currency: string;
    dark_mode: boolean;
  }