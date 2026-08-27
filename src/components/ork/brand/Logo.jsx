import React from 'react';

/**
 * The Orkastor mark and wordmark.
 *
 * Geometry is copied verbatim from `.orkastor-brand/mark-small.svg` and the
 * gradient is the canonical three stops. The retired gen-2 glyph and its
 * purple ramp are what `check_brand.py` exists to catch; do not reintroduce
 * either. Above 48px SPEC wants the full drawing, which is served as an asset
 * rather than inlined — its paths sit inside a flipped potrace transform whose
 * gradientTransform is easy to "tidy" into a flat black mark.
 *
 * The wordmark is ONE text node, solid, uppercase, letterspaced. Not a gradient
 * and not two spans: splitting it breaks the font's shaping run at the seam.
 * `tone` picks the ink; it never picks a gradient.
 */
export function OrkastorLogo({ size = 30, wordmark = true, tone = 'auto', className = '' }) {
  const uid = React.useId().replace(/:/g, '');
  const ink = tone === 'light' ? '#F5F8FA' : tone === 'dark' ? '#0B2A4A' : 'currentColor';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {size >= 48 ? (
        <img src="/brand/mark-full.svg" width={size} height={size} alt="" aria-hidden="true" style={{ display: 'block' }} />
      ) : (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" role="img" aria-label="Orkastor">
          <defs>
            <linearGradient id={`${uid}m`} x1="5" y1="26" x2="27" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B2A4A" />
              <stop offset="45%" stopColor="#17608A" />
              <stop offset="100%" stopColor="#48CBCB" />
            </linearGradient>
          </defs>
          {/* The interrupted ring. The gap is the mark. */}
          <path d="M19.9 29.1A13.6 13.6 0 1 0 12.1 29.1" fill="none" stroke={`url(#${uid}m)`} strokeWidth="2.4" strokeLinecap="round" />
          {/* The orca. */}
          <path
            d="M26.4 13.6C24.6 11.4 21.8 9.6 18.6 9.3C17.2 7.2 15.0 6.0 12.6 6.2C13.9 7.9 14.6 9.4 14.6 11.0C12.0 12.8 10.4 15.6 10.2 18.8C10.1 21.4 10.9 23.6 12.4 25.4C12.6 22.6 13.6 20.4 15.4 18.8C16.2 20.0 17.2 20.7 18.4 20.9C18.0 19.4 17.9 18.1 18.2 17.0C21.2 16.2 24.0 15.0 26.4 13.6 Z"
            fill={`url(#${uid}m)`}
          />
        </svg>
      )}
      {wordmark ? (
        <span
          style={{
            fontSize: size * 0.5,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: ink,
          }}
        >
          Orkastor
        </span>
      ) : null}
    </span>
  );
}

export default OrkastorLogo;
