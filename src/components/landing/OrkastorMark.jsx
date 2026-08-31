import React from 'react';
import { Logo as BrandLogo } from '@/components/ork/brand/markAssets';

/**
 * OrkastorMark — kept for `components/home/*`, which is not on a routed path.
 * The artwork comes from `ork/brand/markAssets.jsx`; do not add a second copy.
 *
 * `light` means the mark sits ON a light surface. Left undefined the theme
 * class decides, which is the right default now the site has a theme toggle.
 */
export default function OrkastorMark({ size = 32, showWordmark = true, light, className = '' }) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <BrandLogo size={size} wordmark={showWordmark} onLight={light} />
    </div>
  );
}
