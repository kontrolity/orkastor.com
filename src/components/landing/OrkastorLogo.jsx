import React from 'react';
import { Logo as BrandLogo } from '@/components/ork/brand/markAssets';

/**
 * OrkastorLogo — kept for `landing/NavBar` and `landing/Footer`, neither of
 * which is imported by anything. It replaced a 250-line "Hex-Triad Intelligence
 * Mark (v4)" — a hexagon frame, three coloured nodes, a workflow triangle,
 * radial spokes, two blur filters and a glowing core, in three palettes. A
 * diagram of a product rather than a mark, and dead code besides.
 *
 * `theme` is still accepted and ignored so no call site breaks. None passed it.
 */
export default function OrkastorLogo({
  size = 32, showWordmark = true, className = '', light,
  // eslint-disable-next-line no-unused-vars
  theme = 'default',
}) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <BrandLogo size={size} wordmark={showWordmark} onLight={light} />
    </div>
  );
}
