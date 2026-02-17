import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to verify the Supabase JWT token from the Authorization header
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

// GET: Fetch all projects (Publicly accessible)
export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Add new project (Protected)
export async function POST(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...newItem } = body;
    
    const { data, error } = await supabase
      .from('projects')
      .insert([newItem])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update project (Protected)
export async function PUT(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove project (Protected)
export async function DELETE(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}