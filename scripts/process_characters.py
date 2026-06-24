"""
캐릭터 PNG 배경 제거 → public/assets/characters/ 에 덮어쓰기

- RGB (흰 배경): 코너 flood-fill (remove_white_bg.py 와 동일 방식)
- RGBA (체크무늬/밝은 배경): remove_checkerboard (crop=False, 치수 유지)

실행: python scripts/process_characters.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from remove_checkerboard import remove_checkerboard

ROOT = Path(__file__).resolve().parent.parent
CHAR_DIR = ROOT / "public" / "assets" / "characters"

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


def process_character(path: Path) -> None:
    im = Image.open(path)
    if im.mode == "RGB":
        result = remove_white_flood(im)
        method = "flood"
    else:
        result = remove_checkerboard(im, crop=False)
        method = "checker"

    transparent = sum(1 for p in result.getdata() if p[3] < 10)
    total = result.size[0] * result.size[1]
    result.save(path, format="PNG", optimize=True)
    print(
        f"  {path.name}: {im.mode} -> RGBA ({method})  "
        f"투명 {transparent / total * 100:.1f}%  -> {path.relative_to(ROOT)}"
    )


def main() -> None:
    files = sorted(CHAR_DIR.glob("character-*.png"))
    if not files:
        print(f"캐릭터 PNG 없음: {CHAR_DIR}")
        return

    print("캐릭터 배경 제거:")
    for path in files:
        process_character(path)
    print("완료.")


if __name__ == "__main__":
    main()
