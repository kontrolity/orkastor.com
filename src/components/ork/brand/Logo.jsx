import React from 'react';
import { Mark, Wordmark, INK, PAPER } from './markGeometry';

/**
 * The Orkastor mark and wordmark.
 *
 * The drawing is in `./markGeometry.jsx`, shared with the two components under
 * `landing/`. It used to be inlined in all three and all three drifted to a
 * retired glyph together, which is why there is now one copy.
 *
 * `tone` picks the ink: 'dark' for a dark mark on a light surface, 'light' for
 * a light mark on a dark one, 'auto' to inherit `currentColor`. It never picks
 * a gradient — this generation of the mark does not have one.
 */
export function OrkastorLogo({ size = 30, wordmark = true, tone = 'auto', className = '' }) {
  const onLight = tone !== 'light';
  const ink = tone === 'light' ? PAPER : tone === 'dark' ? INK : 'currentColor';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span style={{ color: ink, display: 'flex' }}>
        <Mark size={size} onLight={onLight} />
      </span>
      {wordmark ? <Wordmark size={size} onLight={onLight} color={ink} /> : null}
    </span>
  );
}

export default OrkastorLogo;
