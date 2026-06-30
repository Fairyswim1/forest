"""
캐릭터 PNG 배경 제거 → public/assets/characters/ 에 덮어쓰기

- RGB (흰 배경): 코너 flood-fill (remove_white_bg.py 와 동일 방식)
- RGBA (체크무늬/밝은 배경): remove_checkerboard (crop=False, 치수 유지)

실행: python scripts/process_characters.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import binary_closing, binary_dilation, binary_fill_holes

from remove_checkerboard import remove_checkerboard

ROOT = Path(__file__).resolve().parent.parent
CHAR_DIR = ROOT / "public" / "assets" / "characters"

SENTINEL = (255, 0, 255)
FLOOD_THRESH = 95

# 밝은 날개가 flood/checkerboard에 같이 지워지는 캐릭터
FAIRY_CHARACTERS = frozenset({"character-fairy-01.png"})


def remove_white_flood(im: Image.Image, *, thresh: int = FLOOD_THRESH) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        ImageDraw.floodfill(rgb, seed, SENTINEL, thresh=thresh)

    rgba = rgb.convert("RGBA")
    pixels = list(rgba.getdata())
    out = [
        (0, 0, 0, 0) if (r, g, b) == SENTINEL else (r, g, b, 255)
        for r, g, b, _ in pixels
    ]
    rgba.putdata(out)
    return rgba


def remove_character_envelope(im: Image.Image) -> Image.Image:
    """흰 배경과 흰 머리/후드가 연결돼 flood-fill이 내부를 뚫는 캐릭터용."""
    arr = np.array(im.convert("RGB"))
    r = arr[:, :, 0].astype(np.float32)
    g = arr[:, :, 1].astype(np.float32)
    b = arr[:, :, 2].astype(np.float32)
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    sat = (max_c - min_c) / (max_c + 1.0)

    fg_seed = (max_c < 242) | (sat > 0.07)
    fg = binary_closing(fg_seed, iterations=8)
    fg = binary_fill_holes(fg)
    fg = binary_dilation(fg, iterations=2)

    alpha = np.where(fg, 255, 0).astype(np.uint8)
    return Image.fromarray(np.dstack([arr, alpha]), mode="RGBA")


def remove_fairy_character(im: Image.Image) -> Image.Image:
    """밝은 크림색 날개가 배경과 비슷해 flood/checkerboard에 지워지는 요정용."""
    rgb = im.convert("RGB")
    arr_rgb = np.array(rgb)
    max_c = arr_rgb.max(axis=2).astype(np.float32)
    min_c = arr_rgb.min(axis=2).astype(np.float32)
    sat = (max_c - min_c) / (max_c + 1.0)

    flooded = remove_white_flood(rgb, thresh=FLOOD_THRESH)
    core = np.array(flooded)[:, :, 3] > 127

    mask = binary_dilation(core, iterations=35)
    mask = binary_fill_holes(mask)

    h, _ = mask.shape
    upper = np.zeros((h, mask.shape[1]), dtype=bool)
    upper[: int(h * 0.72), :] = True
    light_wing = upper & mask & (max_c > 195) & (max_c < 253) & (sat < 0.14)
    final = binary_fill_holes(mask | light_wing)

    alpha = np.where(final, 255, 0).astype(np.uint8)
    return Image.fromarray(np.dstack([arr_rgb, alpha]), mode="RGBA")


def process_character(path: Path) -> None:
    im = Image.open(path)
    if path.name in FAIRY_CHARACTERS:
        result = remove_fairy_character(im)
        method = "fairy"
    elif im.mode == "RGB":
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
