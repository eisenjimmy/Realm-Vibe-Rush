#!/usr/bin/env python3
"""Fill interior transparent holes in monster game/ sprite frames.

Gallery-sliced CraftPix frames sometimes punch holes through helmets / armor
(chroma-key too aggressive). Exterior transparency (true background) is kept;
only fully enclosed holes are filled with neighboring opaque colors.

Usage:
  python3 scripts/fill_sprite_holes.py
  python3 scripts/fill_sprite_holes.py --pack fantasy-knight
  python3 scripts/fill_sprite_holes.py --dry-run

Backups: first run writes sibling *.png.bak (skipped if already present).
"""
from __future__ import annotations

import argparse
import shutil
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'monsters'
N8 = ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1))


def fill_interior_holes(im: Image.Image) -> tuple[Image.Image, int]:
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()

    exterior = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not exterior[y][x] and px[x, y][3] == 0:
            exterior[y][x] = True
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not exterior[ny][nx] and px[nx, ny][3] == 0:
                exterior[ny][nx] = True
                q.append((nx, ny))

    holes = [(x, y) for y in range(h) for x in range(w) if px[x, y][3] == 0 and not exterior[y][x]]
    if not holes:
        return im, 0

    out = im.copy()
    opx = out.load()
    filled = 0
    remaining = set(holes)

    def opaque_ncount(xy: tuple[int, int]) -> int:
        x, y = xy
        c = 0
        for dx, dy in N8:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and opx[nx, ny][3] > 0:
                c += 1
        return c

    for _ in range(32):
        if not remaining:
            break
        batch = [p for p in remaining if opaque_ncount(p) > 0]
        if not batch:
            for x, y in list(remaining):
                best = None
                best_d = 1e9
                for r in range(1, max(w, h)):
                    for dy in range(-r, r + 1):
                        for dx in range(-r, r + 1):
                            if abs(dx) != r and abs(dy) != r:
                                continue
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < w and 0 <= ny < h and opx[nx, ny][3] > 200:
                                d = dx * dx + dy * dy
                                if d < best_d:
                                    best_d = d
                                    best = opx[nx, ny]
                    if best:
                        break
                if best:
                    r, g, b, _a = best
                    opx[x, y] = (r, g, b, 255)
                    filled += 1
                    remaining.discard((x, y))
            continue

        batch.sort(key=opaque_ncount, reverse=True)
        changed = []
        for x, y in batch:
            rs = gs = bs = n = 0
            for dx, dy in N8:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    pr, pg, pb, pa = opx[nx, ny]
                    if pa > 200:
                        rs += pr
                        gs += pg
                        bs += pb
                        n += 1
            if n:
                opx[x, y] = (rs // n, gs // n, bs // n, 255)
                filled += 1
                changed.append((x, y))
        for p in changed:
            remaining.discard(p)

    return out, filled


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--pack', help='Only process this pack id under assets/monsters/')
    ap.add_argument('--dry-run', action='store_true', help='Report fills without writing')
    args = ap.parse_args()

    packs = [ROOT / args.pack] if args.pack else sorted(p for p in ROOT.iterdir() if p.is_dir())
    total_files = total_filled = 0
    for pack in packs:
        game = pack / 'game'
        if not game.is_dir():
            continue
        for png in sorted(game.glob('*.png')):
            if png.name.endswith('_strip.png') or png.suffixes[-1:] == ['.bak']:
                continue
            if png.name.endswith('.bak'):
                continue
            im = Image.open(png)
            out, n = fill_interior_holes(im)
            total_files += 1
            if n <= 0:
                continue
            total_filled += n
            print(f'{n:4d}  {pack.name}/game/{png.name}')
            if args.dry_run:
                continue
            bak = png.with_suffix('.png.bak')
            if not bak.exists():
                shutil.copy2(png, bak)
            out.save(png, optimize=True)

    print(f'Done. frames={total_files} pixels_filled={total_filled} dry_run={args.dry_run}')


if __name__ == '__main__':
    main()
