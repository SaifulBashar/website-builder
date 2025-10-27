import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Website } from '@/types/blocks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/pages?id=123 - Get store data by ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get('id');

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pages')
      .select('data')
      .eq('id', parseInt(pageId))
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null });
      }
      throw error;
    }

    return NextResponse.json({ data: data.data as Website });
  } catch (error) {
    console.error('Error getting store data:', error);
    return NextResponse.json({ error: 'Failed to get store data' }, { status: 500 });
  }
}

// POST /api/pages - Create new store data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeData }: { storeData: Website } = body;

    if (!storeData) {
      return NextResponse.json({ error: 'Store data is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pages')
      .insert({
        data: storeData,
      })
      .select('id, data')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data.data as Website,
      id: data.id,
    });
  } catch (error) {
    console.error('Error creating store data:', error);
    return NextResponse.json({ error: 'Failed to create store data' }, { status: 500 });
  }
}

// PUT /api/pages - Update existing store data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, storeData }: { pageId: number; storeData: Website } = body;

    if (!pageId || !storeData) {
      return NextResponse.json({ error: 'Page ID and store data are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pages')
      .update({
        data: storeData,
      })
      .eq('id', pageId)
      .select('id, data')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data.data as Website,
      id: data.id,
    });
  } catch (error) {
    console.error('Error updating store data:', error);
    return NextResponse.json({ error: 'Failed to update store data' }, { status: 500 });
  }
}
