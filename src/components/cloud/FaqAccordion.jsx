import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';

/**
 * FAQ list on the Radix accordion primitive directly, rather than the shadcn
 * wrapper in components/ui: that wrapper is untyped JS and fails the repo's
 * checkJs pass when imported from a page, and its styling is built for the
 * dark shadcn token set rather than the .lp light palette.
 *
 * The trigger rotates a plus into a minus. The animation uses the existing
 * accordion-up / accordion-down keyframes in the Tailwind config, and the
 * site-wide prefers-reduced-motion rule stills both.
 */
export default function FaqAccordion({ items }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="w-full">
      {items.map(([question, answer], i) => (
        <AccordionPrimitive.Item
          key={question}
          value={`faq-${i}`}
          className="lpc-row"
        >
          <AccordionPrimitive.Header className="m-0">
            <AccordionPrimitive.Trigger className="group w-full flex items-start justify-between gap-4 py-5 text-left bg-transparent border-0 cursor-pointer">
              <span className="text-[15.5px] font-semibold" style={{ letterSpacing: '-0.015em', color: 'var(--lp-ink)' }}>
                {question}
              </span>
              <Plus
                aria-hidden="true"
                className="w-4 h-4 shrink-0 mt-1 transition-transform duration-200 group-data-[state=open]:rotate-45"
                style={{ color: 'var(--lp-orange-deep)' }}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="text-[14.5px] leading-relaxed pb-5 pr-8 m-0" style={{ color: 'var(--lp-ink-2)' }}>
              {answer}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
