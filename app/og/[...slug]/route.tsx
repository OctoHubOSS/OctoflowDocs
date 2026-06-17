import type { ImageResponse } from 'next/og';
import { metadataImage } from '@/utils/metadata-image';
import { generateOGImage } from './og';

export const runtime = 'edge';

async function loadFont(url: URL): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export const GET = metadataImage.createAPI(async (page, req): Promise<ImageResponse> => {
  const base = new URL(req.url).origin;

  const [regular, bold] = await Promise.all([
    loadFont(new URL('/fonts/Geist-Regular.ttf', base)),
    loadFont(new URL('/fonts/Geist-Bold.ttf', base)),
  ]);

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'Octoflow',
    fonts: [
      { name: 'Geist', data: regular, weight: 400 },
      { name: 'Geist', data: bold, weight: 700 },
    ],
  });
});


