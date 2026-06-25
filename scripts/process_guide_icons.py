"""
가이드 섹션 아이콘 배경 제거 → public/assets/processed/guide/

- RGB (흰 배경): 코너 flood-fill
- RGBA (체크무늬): remove_checkerboard (crop=False)

실행: python scripts/process_guide_icons.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from remove_checkerboard import remove_checkerboard

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "assets"
OUT_DIR = ROOT / "public" / "assets" / "processed" / "guide"

GUIDE_ICON_FILES = [
    "guide-icon-goal.png",
    "guide-icon-flow.png",
    "guide-icon-score.png",
    "guide-icon-undo-time.png",
    "guide-icon-world.png",
    "guide-icon-tip.png",
]

SENTINEL = (255, 0, 255)
FLOOD_THRESH = 95


def remove_white_flood(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        ImageDraw.floodfill(rgb, seed, SENTINEL, thresh=FLOOD_THRESH)

    rgba = rgb.convert("RGBA")
    pixels = list(rgba.getdata())
    out = [
        (0, 0, 0, 0) if (r, g, b) == SENTINEL else (r, g, b, 255)
        for r, g, b, _ in pixels
    ]
    rgba.putdata(out)
    return rgba


def process_icon(name: str) -> None:
    src = SRC_DIR / name
    if not src.exists():
        print(f"SKIP: {name} (원본 없음)")
        return

    im = Image.open(src)
    if im.mode == "RGB":
        result = remove_white_flood(im)
        method = "flood"
    else:
        result = remove_checkerboard(im, crop=False)
        method = "checker"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dest = OUT_DIR / name
    transparent = sum(1 for p in result.getdata() if p[3] < 10)
    total = result.size[0] * result.size[1]
    result.save(dest, format="PNG", optimize=True)
    print(
        f"  {name}: {im.mode} -> RGBA ({method})  "
        f"투명 {transparent / total * 100:.1f}%  -> {dest.relative_to(ROOT)}"
    )


def main() -> None:
    print("가이드 아이콘 배경 제거:")
    for name in GUIDE_ICON_FILES:
        process_icon(name)
    print("완료.")


if __name__ == "__main__":
    main()
