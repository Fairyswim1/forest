"""
플레이 HUD PNG 배경 제거 → public/assets/processed/hud/

- RGB (흰/밝은 배경): 코너 flood-fill
- RGBA (체크무늬): remove_checkerboard (crop=False)

실행: python scripts/process_hud_assets.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from remove_checkerboard import remove_checkerboard

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "assets" / "hud"
OUT_DIR = ROOT / "public" / "assets" / "processed" / "hud"

HUD_FILES = [
    "hud-help-button.png",
    "hud-settings-button.png",
    "hud-score-panel.png",
    "hud-round-pill.png",
    "hud-timer-panel.png",
    "current-card-panel-frame-v2.png",
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


def process_hud(name: str) -> None:
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
    print("HUD 에셋 배경 제거:")
    for name in HUD_FILES:
        process_hud(name)
    print("완료.")


if __name__ == "__main__":
    main()
