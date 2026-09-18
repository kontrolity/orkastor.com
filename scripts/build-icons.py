#!/usr/bin/env python3
"""Build the Orkastor icon set.  Run: python3 scripts/build-icons.py

The tab icon is the SITE's mark. If they ever differ, the site shows one logo
in the page and a different one in its own tab, which is the bug this script
exists to prevent. It reads `public/brand/mark-inverse.png` — the same artwork
`ork/brand/markAssets.jsx` renders in the nav — so regenerating is the whole
fix whenever the mark changes.

WHY THERE ARE TWO DRAWINGS
--------------------------
The mark is a node graph: a hexagon ring, three lit nodes on its vertices, a
hub in the middle, all drawn in thin strokes with a soft glow.

Rendered at true size, the ring's stroke lands under a pixel at 16px. It does
not survive downsampling — the glow smears across the field and what is left
reads as three coloured smudges with no structure. At 32px the ring, the nodes
and the hub all resolve. Both were rendered and compared before choosing the
crossover, so it is measured rather than picked:

    16px  -> the drawing below
    32px+ -> the artwork itself

WHY THE 16px DRAWING IS PIXEL-PLACED, NOT DOWNSAMPLED
-----------------------------------------------------
At this size antialiasing has no room to help: a downsampled diagonal renders
as a row of greys, and the mark is all diagonals. So the small drawing places
pixels directly, on a grid, at full saturation.

It also DROPS THE HEXAGON RING, which is the one liberty taken. Six vertices
cannot be distinguished from three inside a 12px field, and drawing the ring
anyway costs a pixel of contrast everywhere without adding a readable shape.
What identifies the mark at this size is three lit nodes around a lit hub, so
that is what the drawing keeps — the triangle and the spokes, at the vertex
positions and the node colours sampled from the artwork itself.

Node colours below are measured from `mark-inverse.png`, not invented: the top
node is the blue one, the two lower nodes the green/teal pair, the hub white.
If the artwork is re-tinted, re-sample them.

NO IMAGEMAGICK, NO NUMPY
------------------------
This used to shell out to `magick` for the .ico and use numpy for the small
drawing. Both were removed: the script now needs nothing but Pillow, which the
repo already has, so it runs on a clean checkout. `.ico` is a container format
around whole images and is written directly below.
"""
import io
import os
import shutil
import struct
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
ART = os.path.join(PUB, "brand", "mark-inverse.png")   # the nav's own artwork

INDIGO = (0x1F, 0x13, 0x52)
RADIUS = 0.22          # tile corner radius, as a fraction of the side

# Sampled from the artwork. See the docstring.
NODE_TOP = (119, 176, 255)     # blue
NODE_BL = (129, 255, 194)      # green
NODE_BR = (126, 255, 234)      # teal
HUB = (255, 255, 255)
EDGE = (96, 140, 205)          # the connecting strokes, dimmed to sit behind


def pixel_mark(size=16):
    """The small drawing: three lit nodes and a hub, placed pixel by pixel."""
    img = Image.new("RGBA", (size, size), INDIGO + (255,))
    d = ImageDraw.Draw(img)

    # Vertex positions on a 16px grid. The triangle is wider than it is tall,
    # which is what the hexagon's own vertices do.
    top, bl, br, hub = (8, 4), (4, 11), (11, 11), (7, 7)

    # Edges first, so the nodes paint over their ends rather than being
    # outlined by them.
    for a, b in ((top, bl), (top, br), (bl, br)):
        d.line([a[0], a[1], b[0], b[1]], fill=EDGE + (255,), width=1)
    for a in (top, bl, br):
        d.line([a[0], a[1], hub[0], hub[1]], fill=EDGE + (255,), width=1)

    # 2px nodes. 3px crowds the corner radius and 1px reads as a stray pixel;
    # both were rendered at true size before settling here.
    for (x, y), col in ((top, NODE_TOP), (bl, NODE_BL), (br, NODE_BR)):
        d.rectangle([x - 1, y - 1, x, y], fill=col + (255,))
    d.rectangle([hub[0], hub[1], hub[0] + 1, hub[1] + 1], fill=HUB + (255,))
    return img


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


def write_ico(path, images):
    """Write a multi-size .ico.

    Each entry is a whole PNG, which every browser in use has accepted since
    Vista. Pillow's own ICO writer is not used: given several images it keeps
    one and silently drops the rest, and the point of this file is that 16px
    is a DIFFERENT drawing from 32px rather than a resize of it.
    """
    blobs = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        blobs.append(buf.getvalue())

    out = bytearray(struct.pack("<HHH", 0, 1, len(blobs)))   # reserved, type=icon, count
    offset = 6 + 16 * len(blobs)
    for im, blob in zip(images, blobs):
        w, h = im.size
        # 0 means 256 in this field; nothing here is that big, but the encoding
        # is the format's, not ours.
        out += struct.pack("<BBBBHHII", w % 256, h % 256, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
    for blob in blobs:
        out += blob
    with open(path, "wb") as fh:
        fh.write(bytes(out))


def main():
    made = []

    def save(img, name):
        p = os.path.join(PUB, name)
        img.save(p, optimize=True)
        made.append((name, os.path.getsize(p)))
        return p

    ico16 = round_corners(pixel_mark(16), 0.19)     # the drawing
    ico32 = tiled(32, 0.72)                         # the artwork
    ico48 = tiled(48, 0.72)
    save(ico16, "favicon-16.png")
    save(ico32, "favicon-32.png")

    # .ico carries 16/32/48: browsers still reach for /favicon.ico in places the
    # <link> tags do not cover — bookmark bars, history, pinned tabs — and it is
    # requested whether or not it is declared.
    ico_path = os.path.join(PUB, "favicon.ico")
    write_ico(ico_path, [ico16, ico32, ico48])
    made.append(("favicon.ico", os.path.getsize(ico_path)))

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
