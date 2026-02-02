import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const projectName = formData.get('projectName') as string;
    const description = formData.get('description') as string;
    const learned = formData.get('learned') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const technologies = JSON.parse(formData.get('technologies') as string);
    const images = formData.getAll('images') as File[];

    const folderName = projectName.replace(/\s+/g, '-').toLowerCase();
    const publicPath = path.join(process.cwd(), 'public', 'projects', folderName);
    
    // Create folder if not exists
    try { await fs.access(publicPath); } 
    catch { await fs.mkdir(publicPath, { recursive: true }); }

    const imageUrls: string[] = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = image.name.replace(/\s+/g, '_');
      await fs.writeFile(path.join(publicPath, fileName), buffer);
      imageUrls.push(`/projects/${folderName}/${fileName}`);
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'projects-data.json');
    let projects = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      projects = JSON.parse(fileContent);
    } catch { projects = []; }

    projects.push({
      projectName,
      description,
      learned,
      technologies,
      imageUrls,
      githubUrl,
      liveUrl
    });

    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}