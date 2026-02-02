import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { projectName } = await req.json();
    const folderName = projectName.replace(/\s+/g, '-').toLowerCase();
    const publicPath = path.join(process.cwd(), 'public', 'projects', folderName);
    const filePath = path.join(process.cwd(), 'src', 'lib', 'projects-data.json');

    try { await fs.rm(publicPath, { recursive: true, force: true }); } catch (e) {}

    const fileContent = await fs.readFile(filePath, 'utf8');
    let projects = JSON.parse(fileContent);
    projects = projects.filter((p: any) => p.projectName !== projectName);
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: 'Delete failed' }, { status: 500 }); }
}