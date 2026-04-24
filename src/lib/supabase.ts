import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createBrowserClient automatically reads the cookies set by your login page
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Helper to get the CV download link
export const getCvUrl = () => {
  const { data } = supabase.storage.from('assets').getPublicUrl('Hamdhi Resume.pdf');
  return data.publicUrl;
};