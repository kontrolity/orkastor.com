#!/usr/bin/env python3
"""Build the LIGHT-theme brand PNGs from the dark artwork.

Run: python3 scripts/build-brand-light.py

WHAT THIS REPLACES, AND WHY
---------------------------
`mark.png` and `lockup.png` are what `.ork-art--light` shows, i.e. what the
site renders in the light theme. They used to be the artwork sitting on an
opaque near-black rounded CARD — a dark badge, designed back when light meant
a warm off-white page with rounded components.

The mono language has no filled panels and no rounded corners, and the page is
now pure white. A black card with a 15px radius in the top-left corner is both
of the things that language forbids, and it reads as a placeholder rather than
as a logo.

So light is now the artwork itself, in ink, on nothing.

THE ARTWORK IS RECOLOURED, NOT REDRAWN
--------------------------------------
markAssets.jsx says these are crops and must not be re-traced. That still
holds: this script does not draw anything. It takes the dark PNGs pixel for
pixel and moves them to a light ground, which is a colour operation on the
same art.

  hue and saturation  KEPT, so the blue node stays blue and the two green
                      nodes stay green — the mark is recognisably itself
  value               driven down to 0.30, because the art is lit for black
                      and every stroke in it is near-white
  alpha               rebuilt as a THRESHOLD curve, see below

WHY ALPHA IS REBUILT RATHER THAN KEPT
-------------------------------------
The dark art is mostly glow: 8,571 of its pixels sit at alpha 0-31 and only
139 at 224-255. Glow is how a light-on-dark drawing reads as lit. Inverted onto
white, those same halos become grey haze around every stroke and the mark looks
smudged.

A plain gamma on alpha dims the haze but dims the strokes with it. So the curve
has a floor and a lift instead: everything below `CUT` is glow and is dropped
outright, and what survives is pushed toward opaque. Measured by eye at true
nav size (38px) across three settings before landing here.

THE WORDMARK KEEPS ITS TWO TONES
--------------------------------
"Orka" is white in the source and "stor" is periwinkle. Flattening both to ink
would throw away the one piece of colour the wordmark has. They are separated
by SATURATION rather than by an x cut-off, so the split follows the letterforms
even where they are kerned into each other:

  low saturation  -> --text  #16171A
  high saturation -> the reference blue #001AD0, which is 10.20:1 on white and
                     is the light theme's real accent (see mono.css)

GEOMETRY IS IDENTICAL TO THE DARK FILES, ON PURPOSE
---------------------------------------------------
markAssets.jsx has ONE MARK_RATIO and ONE LOCKUP_RATIO, used for both tints.
If the light lockup were a different size than the dark one, one of the two
themes would render the art stretched. So the output canvases match the source
canvases exactly and only the pixels change.
"""
import colorsys
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "public", "brand")

INK = (0x16, 0x17, 0x1A)      # --text on white, 17.92:1
ACCENT = (0x00, 0x1A, 0xD0)   # --ork-accent-text on white, 10.20:1

VALUE = 0.30      # target HSV value for the mark's strokes
SAT = 1.35        # saturation lift, to hold the hue at that darkness
CUT = 0.22        # alpha below this is glow, and is dropped
GAIN = 0.60       # what survives is lifted toward opaque


def relight(im):
    """The mark: same hues, dark enough for white, glow removed."""
    out = Image.new("RGBA", im.size)
    sp, op = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = sp[x, y]
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
                continue
            hh, ss, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            nr, ng, nb = colorsys.hsv_to_rgb(hh, min(1.0, ss * SAT), VALUE)
            t = (a / 255.0 - CUT) / (1.0 - CUT)
            na = 0 if t <= 0 else int(255 * min(1.0, t ** GAIN))
            op[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), na)
    return out


def reink(im):
    """The wordmark: white -> ink, periwinkle -> the accent, alpha untouched.

    Alpha is kept exactly here, unlike the mark: type has no glow to remove and
    its edges ARE its antialiasing. Touching them would thicken the wordmark at
    small sizes, which on a logotype reads as a different weight of the font.
    """
    out = Image.new("RGBA", im.size)
    sp, op = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = sp[x, y]
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
                continue
            _, ss, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            # Ramp rather than a hard test, so a pixel on the boundary between
            # the two words blends instead of picking a side.
            f = max(0.0, min(1.0, (ss - 0.10) / 0.25))
            c = tuple(int(INK[i] + (ACCENT[i] - INK[i]) * f) for i in range(3))
            op[x, y] = (c[0], c[1], c[2], a)
    return out


def main():
    mark_dark = Image.open(os.path.join(BRAND, "mark-inverse.png")).convert("RGBA")
    lock_dark = Image.open(os.path.join(BRAND, "lockup-inverse.png")).convert("RGBA")

    mark_light = relight(mark_dark)
    mark_light.save(os.path.join(BRAND, "mark.png"), optimize=True)

    # The lockup is rebuilt on the dark file's own canvas, so the mark and the
    # wordmark land on exactly the coordinates they already occupy. The split
    # at x=126 is the gap measured in the dark artwork.
    SPLIT = 126
    out = Image.new("RGBA", lock_dark.size, (0, 0, 0, 0))
    out.alpha_composite(relight(lock_dark.crop((0, 0, SPLIT, lock_dark.height))), (0, 0))
    out.alpha_composite(reink(lock_dark.crop((SPLIT, 0, lock_dark.width, lock_dark.height))), (SPLIT, 0))
    out.save(os.path.join(BRAND, "lockup.png"), optimize=True)

    for n in ("mark.png", "lockup.png"):
        p = os.path.join(BRAND, n)
        im = Image.open(p)
        print(f"  {n:<16} {im.size[0]}x{im.size[1]}  {os.path.getsize(p) // 1024 or 1}KB")


if __name__ == "__main__":
    sys.exit(main())
