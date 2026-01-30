import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get the CV download link
export const getCvUrl = () => {
  const { data } = supabase.storage.from('assets').getPublicUrl('john doe resume PDF.pdf');
  return data.publicUrl;
};