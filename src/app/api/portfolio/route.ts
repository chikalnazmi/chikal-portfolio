import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_PORTFOLIO_DATA, PortfolioData, cleanPortfolioData } from '@/lib/portfolio-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'CDN-Cache-Control': 'no-store',
  };

  try {
    const client = supabaseAdmin || supabase;
    if (!client || !isSupabaseConfigured) {
      return NextResponse.json(
        {
          source: 'default',
          isSupabaseConnected: false,
          data: DEFAULT_PORTFOLIO_DATA,
        },
        { headers }
      );
    }

    const { data, error } = await client
      .from('portfolio_content')
      .select('content, updated_at')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.error('API /api/portfolio GET database error:', error);
      return NextResponse.json(
        {
          source: 'error-fallback',
          isSupabaseConnected: true,
          data: DEFAULT_PORTFOLIO_DATA,
        },
        { headers }
      );
    }

    // If row doesn't exist yet, seed initial row with default portfolio data
    if (!data || !data.content || Object.keys(data.content).length === 0) {
      await client.from('portfolio_content').upsert({
        id: 'main',
        content: DEFAULT_PORTFOLIO_DATA,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          source: 'initial-seeded',
          isSupabaseConnected: true,
          updatedAt: new Date().toISOString(),
          data: DEFAULT_PORTFOLIO_DATA,
        },
        { headers }
      );
    }

    return NextResponse.json(
      {
        source: 'supabase',
        isSupabaseConnected: true,
        updatedAt: data.updated_at,
        data: cleanPortfolioData(data.content as Partial<PortfolioData>),
      },
      { headers }
    );
  } catch (err: any) {
    console.error('API /api/portfolio GET fatal error:', err);
    return NextResponse.json(
      {
        source: 'fatal-error',
        isSupabaseConnected: false,
        data: DEFAULT_PORTFOLIO_DATA,
      },
      { headers }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = supabaseAdmin || supabase;
    if (!client || !isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    const payload = (await req.json()) as PortfolioData;
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload: data object is required' },
        { status: 400 }
      );
    }

    const cleaned = cleanPortfolioData(payload);
    const nowIso = new Date().toISOString();

    const { error } = await client
      .from('portfolio_content')
      .upsert({
        id: 'main',
        content: cleaned,
        updated_at: nowIso,
      });

    if (error) {
      console.error('API /api/portfolio POST database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Invalidate Next.js cache so both visitor and admin see fresh data immediately
    try {
      revalidatePath('/', 'page');
      revalidatePath('/admin', 'page');
    } catch {}

    return NextResponse.json({
      success: true,
      updatedAt: nowIso,
      data: cleaned,
      message: 'Portfolio data successfully updated in Supabase Cloud Database',
    });
  } catch (err: any) {
    console.error('API /api/portfolio POST fatal error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update portfolio data' },
      { status: 500 }
    );
  }
}
