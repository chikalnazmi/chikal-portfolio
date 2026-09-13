import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { supabaseAdmin, supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename and make it unique with timestamp
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${cleanName}`;

    // 1. If Supabase is configured, upload to Supabase Storage bucket 'portfolio'
    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured && client) {
      try {
        // Ensure bucket exists
        const { data: buckets } = await client.storage.listBuckets();
        const hasBucket = buckets?.some(b => b.name === 'portfolio');
        if (!hasBucket) {
          await client.storage.createBucket('portfolio', {
            public: true,
            fileSizeLimit: 20971520,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'],
          });
        }

        // Determine content type safely
        let contentType = file.type || 'image/jpeg';
        if (cleanName.endsWith('.webp')) contentType = 'image/webp';
        else if (cleanName.endsWith('.png')) contentType = 'image/png';
        else if (cleanName.endsWith('.jpg') || cleanName.endsWith('.jpeg')) contentType = 'image/jpeg';

        const { data: uploadData, error: uploadErr } = await client.storage
          .from('portfolio')
          .upload(`uploads/${filename}`, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = client.storage
            .from('portfolio')
            .getPublicUrl(`uploads/${filename}`);

          if (publicUrlData?.publicUrl) {
            // Also mirror to local public/uploads for backup
            try {
              const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
              await fs.mkdir(uploadsDir, { recursive: true });
              await fs.writeFile(path.join(uploadsDir, filename), buffer);
            } catch {}

            return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
          }
        } else if (uploadErr) {
          console.warn('Supabase storage upload error:', uploadErr);
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload fallback to local disk:', storageErr);
      }
    }

    // 2. Fallback to local disk (public/uploads)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload file' }, { status: 500 });
  }
}
