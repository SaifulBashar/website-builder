import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Website } from '@/types/blocks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// POST /api/pages/upsert - Upsert store data (create or update)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, storeData }: { pageId: number | null; storeData: Website } = body;

    if (!storeData) {
      return NextResponse.json({ error: 'Store data is required' }, { status: 400 });
    }

    if (pageId) {
      // Try to update existing record
      const { data, error } = await supabase
        .from('pages')
        .update({
          data: storeData,
        })
        .eq('id', pageId)
        .select('id, data')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record doesn't exist, insert new one
          const { data: insertData, error: insertError } = await supabase
            .from('pages')
            .insert({
              data: storeData,
            })
            .select('id, data')
            .single();

          if (insertError) {
            throw insertError;
          }

          return NextResponse.json({
            data: insertData.data as Website,
            id: insertData.id,
          });
        }
        throw error;
      }

      return NextResponse.json({
        data: data.data as Website,
        id: data.id,
      });
    } else {
      // Insert new record
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
    }
  } catch (error) {
    console.error('Error upserting store data:', error);
    return NextResponse.json({ error: 'Failed to upsert store data' }, { status: 500 });
  }
}
