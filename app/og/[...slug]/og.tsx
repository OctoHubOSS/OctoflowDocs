import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';
import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types';

interface GenerateProps {
  title: string;
  description?: string;
  site?: string;
}

export function generateOGImage(
  options: GenerateProps & ImageResponseOptions,
): ImageResponse {
  const { title, description, site, ...rest } = options;

  return new ImageResponse(
    <OGTemplate title={title} description={description} site={site} />,
    {
      width: 1200,
      height: 630,
      ...rest,
    },
  );
}

function OGTemplate({ title, description, site }: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        color: 'white',
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }}
      />
      {/* Blue glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(ellipse 55% 45% at 8% 0%, rgba(59,130,246,0.15), transparent)',
          display: 'flex',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          height: '100%',
        }}
      >
        {/* Site label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '22px',
          }}
        >
          {site ?? 'Octoflow'}
        </div>

        {/* Title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p
            style={{
              fontSize: title.length > 30 ? '60px' : '72px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-1.5px',
              margin: 0,
              color: 'white',
            }}
          >
            {title}
          </p>
          {description && (
            <p
              style={{
                fontSize: '30px',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {description.length > 100
                ? description.slice(0, 97) + '...'
                : description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            color: 'rgba(255,255,255,0.28)',
            fontSize: '18px',
          }}
        >
          octoflow.ca
        </div>
      </div>
    </div>
  );
}
