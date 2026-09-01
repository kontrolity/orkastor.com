#!/usr/bin/env python3
"""Build the Orkastor icon set.  Run: python3 scripts/build-icons.py

WHY THERE ARE TWO DRAWINGS
--------------------------
The brand artwork (public/brand/mark.png, cropped from the supplied sheet) is a
lattice with NO enclosed counter: it is split down the centre line, so every
interior channel opens to the outside. Measured on the 240x278 crop, the mid
row is four ink bands separated by gaps of 18, 62 and 17 pixels, and ink covers
42.9% of the box.

Scale that to 16px and the bands land on ~2px and the side gaps on ~1.2px. They
close, and the mark resolves to a grey smudge with no structure. At 32px it
reads cleanly. Both were rendered at true size and compared before choosing the
crossover, which is therefore measured rather than picked:

    16px  -> the drawing below
    32px+ -> the artwork itself

WHY THE 16px DRAWING IS PIXEL-PLACED, NOT DOWNSAMPLED
-----------------------------------------------------
A downsampled vector renders its diagonals as grey at this size; there is not
enough room for antialiasing to help. So the 16px icon places pixels directly.

PROFILE is the artwork's OWN silhouette — the per-row half-width as a fraction
of the maximum, sampled at 14 rows off the alpha mask and mirror-averaged for
symmetry. It is measured, not drawn by eye. Regenerate it with the snippet in
the docstring of `profile()` if the artwork ever changes.

THE SLOT STOPS SHORT OF THE EDGES, ON PURPOSE
---------------------------------------------
The artwork's central channel runs the full height. Reproduced that way at 16px
it severs the glyph and you read two facing D-shapes rather than one mark. The
slot here stops three rows in from the top and bottom, which keeps the form
connected while preserving the vertical channel that identifies the mark.
"""
from PIL import Image, ImageDraw
import numpy as np, subprocess, shutil, sys, os

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB    = os.path.join(ROOT, "public")
ART    = os.path.join(PUB, "brand", "mark-inverse.png")   # paper-tinted artwork

INDIGO = (0x1F, 0x13, 0x52)
PAPER  = (0xF5, 0xF6, 0xFA)
RADIUS = 0.22          # tile corner radius, as a fraction of the side

# The artwork's silhouette: half-width / max-half-width, 14 samples top to
# bottom.  Sharp points at each end, a broad flat middle.
#   a = np.array(Image.open("public/brand/mark.png"))[...,3] > 127
#   per row: ((cx - xs.min()) + (xs.max() - cx)) / 2, normalised by the max
PROFILE = [0.054, 0.225, 0.429, 0.787, 0.988, 0.963, 0.996,
           0.996, 0.979, 0.988, 0.771, 0.429, 0.221, 0.054]


def profile(rows):
    """PROFILE resampled to `rows` rows, linearly."""
    out = []
    for y in range(rows):
        t = y * (len(PROFILE) - 1) / (rows - 1)
        i = int(t); f = t - i
        out.append(PROFILE[i] if i + 1 >= len(PROFILE)
                   else PROFILE[i] * (1 - f) + PROFILE[i + 1] * f)
    return out


def pixel_mark(size=16, half_max=7.0, slot_half=2.0, slot_from=3, slot_to=12):
    """The small drawing, placed pixel by pixel."""
    prof, cx = profile(size), size / 2
    img = np.zeros((size, size, 4), np.uint8)
    img[..., :3] = INDIGO
    img[...,  3] = 255
    for y in range(size):
        hw = prof[y] * half_max
        for x in range(size):
            d = abs((x + 0.5) - cx)
            if d <= hw and not (slot_from <= y <= slot_to and d < slot_half):
                img[y, x, :3] = PAPER
    return Image.fromarray(img)


def round_corners(img, frac=RADIUS):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1],
                                           radius=max(1, int(min(w, h) * frac)), fill=255)
    img = img.convert("RGBA"); img.putalpha(mask)
    return img


def tiled(size, inset, opaque=False):
    """The artwork centred on the indigo tile."""
    art = Image.open(ART).convert("RGBA")
    w, h = art.size
    sc = (size * inset) / max(w, h)
    art = art.resize((max(1, int(w * sc)), max(1, int(h * sc))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), INDIGO + (255,))
    canvas.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))
    # iOS composites alpha against BLACK and rounds the corners itself, so its
    # icon must be a flat RGB square. Android's maskable icon must bleed to the
    # full square too, because the launcher crops its own shape out of it.
    return canvas.convert("RGB") if opaque else round_corners(canvas)


def main():
    made = []

    def save(img, name):
        p = os.path.join(PUB, name)
        img.save(p, optimize=True)
        made.append((name, os.path.getsize(p)))
        return p

    save(round_corners(pixel_mark(16), 0.19), "favicon-16.png")   # the drawing
    save(tiled(32, 0.72), "favicon-32.png")                       # the artwork
    ico48 = os.path.join(PUB, "_ico48.png")
    tiled(48, 0.72).save(ico48)

    # .ico carries 16/32/48: browsers still reach for /favicon.ico in places the
    # <link> tags do not cover — bookmark bars, history, pinned tabs — and it is
    # requested whether or not it is declared.
    subprocess.run(["magick", os.path.join(PUB, "favicon-16.png"),
                    os.path.join(PUB, "favicon-32.png"), ico48,
                    os.path.join(PUB, "favicon.ico")], check=True)
    made.append(("favicon.ico", os.path.getsize(os.path.join(PUB, "favicon.ico"))))
    os.remove(ico48)

    save(tiled(180, 0.70, opaque=True), "apple-touch-icon.png")
    save(tiled(192, 0.72), "icon-192.png")
    save(tiled(512, 0.72), "icon-512.png")
    # maskable: the launcher crops to a shape inside the inner 80%, so the art
    # sits in the safe zone and the tile bleeds to the edges.
    save(tiled(512, 0.50, opaque=True), "icon-maskable-512.png")
    shutil.copyfile(os.path.join(PUB, "icon-512.png"), os.path.join(PUB, "favicon.png"))
    made.append(("favicon.png", os.path.getsize(os.path.join(PUB, "favicon.png"))))

    for n, b in made:
        print(f"  {n:<26} {b // 1024 or 1}KB")


if __name__ == "__main__":
    sys.exit(main())
