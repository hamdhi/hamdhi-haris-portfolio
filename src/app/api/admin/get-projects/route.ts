import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Security Check: Only admin can fetch the full list for management
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'projects-data.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContent);

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json([], { status: 200 }); // Return empty array if file missing
  }
}