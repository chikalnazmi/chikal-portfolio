import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_PORTFOLIO_DATA, PortfolioData } from '@/lib/portfolio-store';

export async function GET() {
  try {
    const client = supabaseAdmin || supabase;
    if (!client || !isSupabaseConfigured) {
      return NextResponse.json({
        source: 'default',
        isSupabaseConnected: false,
        data: DEFAULT_PORTFOLIO_DATA
      });
    }

    const { data, error } = await client
      .from('portfolio_content')
      .select('content, updated_at')
      .eq('id', 'main')
      .single();

    if (error || !data || !data.content || Object.keys(data.content).length === 0 || !data.content.hero) {
      // Auto-seed full default data if empty or only partial test payload
      const mergedContent = {
        ...DEFAULT_PORTFOLIO_DATA,
        ...(data?.content || {})
      };

      await client.from('portfolio_content').upsert({
        id: 'main',
        content: mergedContent,
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        source: 'auto-seeded',
        isSupabaseConnected: true,
        data: mergedContent
      });
    }

    return NextResponse.json({
      source: 'supabase',
      isSupabaseConnected: true,
      updatedAt: data.updated_at,
      data: data.content
    });
  } catch (err: any) {
    console.error('API /api/portfolio GET error:', err);
    return NextResponse.json({
      source: 'fallback-error',
      isSupabaseConnected: false,
      data: DEFAULT_PORTFOLIO_DATA
    });
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

    const payload = await req.json() as PortfolioData;
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const { error } = await client
      .from('portfolio_content')
      .upsert({
        id: 'main',
        content: payload,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('API /api/portfolio POST Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio data successfully synchronized to Supabase Cloud'
    });
  } catch (err: any) {
    console.error('API /api/portfolio POST error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update portfolio data' },
      { status: 500 }
    );
  }
}
