import React from 'react';
import { Logo as BrandLogo } from './markAssets';

/**
 * The Orkastor mark and wordmark. This is the one on the routed path —
 * `Layout` renders it in `ork/nav/Navbar` and `ork/layout/Footer`.
 *
 * The artwork is cropped from the approved brand sheet; see `./markAssets.jsx`
 * for how, and for why each shape ships in two tints.
 *
 * `tone` is kept for the existing callers. 'auto' now means "let the theme
 * class decide", which is what it should always have meant — the old value
 * resolved to `currentColor`, and raster art cannot inherit that.
 */
export function OrkastorLogo({ size = 30, wordmark = true, tone = 'auto', className = '' }) {
  const onLight = tone === 'auto' ? undefined : tone === 'dark';
  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <BrandLogo size={size} wordmark={wordmark} onLight={onLight} />
    </span>
  );
}

export default OrkastorLogo;
