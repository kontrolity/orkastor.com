/**
 * Cookie consent banner.
 *
 * Three actions — Deny, Accept all, Consent Settings — with Deny and Accept
 * all rendered at IDENTICAL size and shape (same Button variant pair used
 * everywhere else in this app, only the color differs). This isn't cosmetic:
 * CNIL issued a formal-notice wave in Dec 2024, and Sweden's IMY followed in
 * 2025, specifically over sites where "reject" was visually weaker or took
 * more clicks than "accept" — asymmetric prominence is treated as a dark
 * pattern and actively enforced against, not just discouraged.
 *
 * Consent Settings breaks out the standard four categories (Strictly
 * Necessary / Analytics / Functional / Marketing). Strictly Necessary is
 * locked on — it's the one category GDPR exempts from consent — everything
 * else defaults OFF and requires an affirmative opt-in.
 *
 * A custom lightweight banner rather than a paid CMP (OneTrust/Cookiebot/
 * Osano): appropriate at this scale — OneTrust's minimum contract alone is
 * now $10k/yr, clearly enterprise-scale gear for a startup marketing site.
 *
 * The decision persists to localStorage as a small JSON object, not a flat
 * "all" string — real per-category granularity from day one. There's no
 * analytics/tracking script wired up in this app yet, so there's nothing to
 * gate behind consent today; this just needs to record the decision
 * correctly so whatever gets added later (PostHog, most likely) has
 * something real to check — e.g.
 * `JSON.parse(localStorage.getItem('orkastor_cookie_consent') || 'null')?.analytics === true`.
 */
import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const STORAGE_KEY = 'orkastor_cookie_consent';

/** Fired by anything (e.g. a footer "Cookie preferences" link) that wants to
 *  reopen the settings panel after a decision has already been made — consent
 *  has to be as easy to withdraw or change as it was to give. */
const REOPEN_EVENT = 'orkastor:open-cookie-settings';

export function openCookiePreferences() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(REOPEN_EVENT));
}

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeConsent(categories) {
  const value = { necessary: true, ...categories, decidedAt: new Date().toISOString() };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* storage unavailable */ }
  return value;
}

function draftFrom(current) {
  return {
    analytics: current?.analytics ?? false,
    functional: current?.functional ?? false,
    marketing: current?.marketing ?? false,
  };
}

const ALL_ON = { analytics: true, functional: true, marketing: true };
const ALL_OFF = { analytics: false, functional: false, marketing: false };

export default function CookieConsent() {
  const [consent, setConsent] = useState(() => readConsent());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState(() => draftFrom(readConsent()));

  const openSettings = useCallback(() => {
    setDraft(draftFrom(readConsent()));
    setSettingsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(REOPEN_EVENT, openSettings);
    return () => window.removeEventListener(REOPEN_EVENT, openSettings);
  }, [openSettings]);

  const decide = useCallback((categories) => {
    setConsent(writeConsent(categories));
    setSettingsOpen(false);
  }, []);

  const showBanner = !consent;

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-muted-foreground">
              This site uses tracking technologies. You may opt in or opt out of the use of these technologies.
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {/* Deny and Accept all are the SAME Button size/variant pair used
                  everywhere else in this app — identical shape, only color
                  differs. `text-foreground` is explicit here (not left to
                  inherit) because this app's global `body` color is tuned for
                  its default dark atmosphere and isn't corrected back to a
                  dark ink tone under the light `.lp` page background — every
                  other piece of text in the app works around that with its
                  own explicit color; this is the one spot that didn't yet. */}
              <Button variant="outline" size="sm" className="text-foreground" onClick={() => decide(ALL_OFF)}>
                Deny
              </Button>
              <Button variant="default" size="sm" onClick={() => decide(ALL_ON)}>
                Accept all
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={openSettings}>
                Consent Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Consent Settings</DialogTitle>
            <DialogDescription>
              Choose which categories of cookies and tracking technologies we may use. Strictly necessary cookies keep
              the site working and can't be turned off.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <CategoryRow
              label="Strictly Necessary"
              description="Required for the site to function — session state, security, load balancing."
              checked
              locked
            />
            <CategoryRow
              label="Analytics"
              description="Helps us understand how the site is used, so we can improve it."
              checked={draft.analytics}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
            />
            <CategoryRow
              label="Functional"
              description="Remembers choices you make on the site to personalize your visit."
              checked={draft.functional}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, functional: v }))}
            />
            <CategoryRow
              label="Marketing"
              description="Used to measure and improve the effectiveness of our marketing."
              checked={draft.marketing}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" className="text-foreground" onClick={() => decide(ALL_OFF)}>
              Deny all
            </Button>
            <Button onClick={() => decide(draft)}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CategoryRow({ label, description, checked, onCheckedChange = undefined, locked = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-foreground">
          {label}
          {locked ? <span className="ml-2 text-xs text-muted-foreground">Always Active</span> : null}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={locked ? undefined : onCheckedChange} disabled={locked} />
    </div>
  );
}
