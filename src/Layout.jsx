import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * The shell every route renders inside.
 *
 * ── WHY THE FIELD LIVES HERE ────────────────────────────────────────────────
 *
 * `.ork-field` is the site's animated gradient backdrop. It is mounted once,
 * here, rather than per page, and that is deliberate on three counts:
 *
 *   1. EVERY ROUTE GETS IT. Mounting it in OrkHome would have given the home
 *      page a gradient and every other page a flat ground, which is the exact
 *      inconsistency a shared layout exists to prevent.
 *
 *   2. IT SURVIVES NAVIGATION. Layout sits outside the <Outlet />, so a route
 *      change swaps the page beneath a field that never unmounts — no restart
 *      of a 61-second animation on every click, and no flash of flat colour
 *      between routes.
 *
 *   3. IT IS ONE ELEMENT. The field is `position: fixed`, so a single node
 *      covers the viewport for the life of the session regardless of how long
 *      any page is.
 *
 * ⚠ aria-hidden and pointer-events: none (set in CSS). It is decoration with
 * no content and must never take a tab stop or eat a click.
 *
 * ⚠ The `.ork` class is what scopes the design tokens, and the field reads
 * --atmos-* from them, so it has to be INSIDE that scope rather than a
 * sibling of it.
 */
export default function Layout() {
  return (
    <div className="ork min-h-screen">
      <div className="ork-field" aria-hidden="true" />
      <Outlet />
    </div>
  );
}
