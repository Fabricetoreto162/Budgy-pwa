import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  async getMine(): Promise<Profile> {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user!.id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(patch: Partial<Profile>): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userData.user!.id);

    if (error) throw error;
  }

  // Méthode ajoutée pour corriger l'erreur dans SignupPage
  async updateProfile(patch: Partial<Profile>): Promise<void> {
    return this.update(patch);
  }
}