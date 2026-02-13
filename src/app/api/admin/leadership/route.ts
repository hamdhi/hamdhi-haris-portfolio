import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all items
export async function GET() {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}

// POST: Add new item
export async function POST(req: Request) {
  const body = await req.json();
  
  // Clean up the body to ensure we don't send extra fields
  const { id, ...newItem } = body; 

  const { data, error } = await supabase
    .from('leadership')
    .insert([newItem])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0]);
}

// PUT: Update item
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('leadership')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0]);
}

// DELETE: Remove item
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabase
    .from('leadership')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}