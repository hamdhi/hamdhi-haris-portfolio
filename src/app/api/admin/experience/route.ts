import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (or import from lib/supabase.ts if you created that file)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // Fetch data from 'experience' table
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('id', { ascending: true }); // Keep them in order of creation

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}