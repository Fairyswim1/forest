"""
게임 에셋 전처리: 체크무늬 제거 → assets/processed/ → public/assets/processed/
정적 배경(숲)은 public/assets/ 로 복사
"""
from __future__ import annotations

import shutil
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PROCESSED = ROOT / "assets" / "processed"
PUBLIC_PROCESSED = ROOT / "public" / "assets" / "processed"
PUBLIC_ASSETS = ROOT / "public" / "assets"

TILE_FILES = ["empty_tile.png", "selected_tile.png", "placed_tile.png", "success_tile.png"]
ACTION_FILES = ["confirm_button.png", "undo_button.png"]
WORLDMAP_NODE_FILES = ["open.png", "node.png", "close.png"]
HUD_FILES = {
    "stage_frame.png": "hud/stage_frame.png",
    "round_frame.png": "hud/round_frame.png",
    "score_frame.png": "hud/score_frame.png",
    "star_icon.png": "hud/star_icon.png",
    "menu_button.png": "hud/menu_button.png",
}
CARD_NAMES = ("current_card.png", "card_frame.png", "current_card_panel.png")
STATIC_BG = "forest_playfield_bg.png"
TRAIL_OVERLAY = "board_trail_overlay.png"

PUBLIC_WORLD_ASSETS: list[tuple[str, str, bool]] = [
    ("integer-cave-trail-overlay.png", "integer-cave-trail-overlay.png", False),
    ("integer-cave-node-open.png", "integer-cave/node-open.png", True),
    ("integer-cave-node-locked.png", "integer-cave/node-locked.png", True),
    ("rational-meadow-trail-overlay.png", "rational-meadow-trail-overlay.png", False),
    ("rational-meadow-node-open.png", "rational-meadow/node-open.png", True),
    ("rational-meadow-node-locked.png", "rational-meadow/node-locked.png", True),
    ("rational-meadow-node-complete.png", "rational-meadow/node-complete.png", True),
    ("real-starlight-space-trail-overlay.png", "real-starlight-space-trail-overlay.png", False),
    ("real-starlight-space-node-open.png", "real-starlight-space/node-open.png", True),
    ("real-starlight-space-node-locked.png", "real-starlight-space/node-locked.png", True),
    ("real-starlight-space-node-complete.png", "real-starlight-space/node-complete.png", True),
]

# 결과 화면 프레임·배지 — 체커보드 배경만 투명 처리, 치수 유지(crop=False)
RESULT_ASSETS = [
    "result-completion-banner-frame.png",
    "result-run-score-panel-frame.png",
    "run_badge_1_gold.png",
    "run_badge_2_mint.png",
    "run_badge_3_sky.png",
    "run_badge_4_pink.png",
    "run_badge_5_purple.png",
]


def find_tile_src(name: str) -> Path | None:
    for rel in (f"assets/{name}", f"assets/tiles/{name}"):
        p = ROOT / rel
        if p.exists():
            return p
    return None


def find_action_src(name: str) -> Path | None:
    for rel in (f"assets/actions/{name}", f"assets/{name}"):
        p = ROOT / rel
        if p.exists():
            return p
    return None


def find_hud_src(name: str) -> Path | None:
    for rel in (f"assets/hud/{name}", f"assets/{name}"):
        p = ROOT / rel
        if p.exists():
            return p
    return None


def find_card_src() -> Path | None:
    cards_dir = ROOT / "assets" / "cards"
    if cards_dir.is_dir():
        for name in CARD_NAMES:
            p = cards_dir / name
            if p.exists():
                return p
        for p in sorted(cards_dir.glob("*.png")):
            return p
    for name in CARD_NAMES:
        p = ROOT / "assets" / name
        if p.exists():
            return p
    return None


def sample_checker_colors(img: Image.Image) -> set[tuple[int, int, int]]:
    rgba = np.array(img.convert("RGBA"))
    h, w = rgba.shape[:2]
    colors: set[tuple[int, int, int]] = set()
    for y in range(0, h, max(1, h // 40)):
        for x in range(0, w, max(1, w // 40)):
            if x < 8 or y < 8 or x >= w - 8 or y >= h - 8:
                r, g, b, a = rgba[y, x]
                if a < 10:
                    continue
                if _is_neutral_light(int(r), int(g), int(b)):
                    colors.add((int(r), int(g), int(b)))
    return colors


def _is_neutral_light(r: int, g: int, b: int) -> bool:
    if abs(r - g) > 20 or abs(g - b) > 20 or abs(r - b) > 20:
        return False
    return max(r, g, b) >= 150


def _is_stone_or_moss(r: int, g: int, b: int) -> bool:
    if g > r + 12 and g > b + 8 and g > 70:
        return True
    if r > b + 12 and r > 85:
        return True
    if b > r + 20 and b > 100:
        return True
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    sat = (max_c - min_c) / (max_c + 1e-6)
    if sat > 0.14 and min_c < 200:
        return True
    return False


def remove_checkerboard(img: Image.Image, *, crop: bool = True) -> Image.Image:
    rgba = np.array(img.convert("RGBA"), dtype=np.uint8)
    h, w = rgba.shape[:2]
    r = rgba[:, :, 0].astype(np.int16)
    g = rgba[:, :, 1].astype(np.int16)
    b = rgba[:, :, 2].astype(np.int16)

    checker_colors = sample_checker_colors(img)
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    sat = (max_c - min_c) / (max_c + 1.0)

    neutral = (np.abs(r - g) <= 20) & (np.abs(g - b) <= 20) & (np.abs(r - b) <= 20)
    bg_mask = (neutral & (max_c >= 155) & (sat < 0.11)) | ((r >= 245) & (g >= 245) & (b >= 245))

    for cr, cg, cb in checker_colors:
        near = (np.abs(r - cr) <= 24) & (np.abs(g - cg) <= 24) & (np.abs(b - cb) <= 24)
        bg_mask = bg_mask | near

    stone = np.zeros((h, w), dtype=bool)
    for y in range(h):
        for x in range(w):
            if _is_stone_or_moss(int(r[y, x]), int(g[y, x]), int(b[y, x])):
                stone[y, x] = True

    rgba[bg_mask & ~stone, 3] = 0
    out = Image.fromarray(rgba, mode="RGBA")

    if not crop:
        return out

    bbox = out.getbbox()
    if bbox:
        pad = 8
        out = out.crop((
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        ))
    return out


def publish_processed(dest_rel: str) -> None:
    src = PROCESSED / dest_rel
    if not src.exists():
        return
    dest = PUBLIC_PROCESSED / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


def process(src: Path, dest_rel: str, *, crop: bool = True) -> None:
    dest = PROCESSED / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    result = remove_checkerboard(Image.open(src), crop=crop)
    result.save(dest, format="PNG", optimize=True)
    print(f"OK: {dest_rel} ({result.size[0]}x{result.size[1]}) <- {src.name}")
    publish_processed(dest_rel)


def copy_static(src_rel: str, public_name: str | None = None) -> None:
    src = ROOT / src_rel
    if not src.exists():
        print(f"SKIP static: {src_rel}")
        return
    name = public_name or src.name
    dest = PUBLIC_ASSETS / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    print(f"COPY: {dest}")


def process_public_src(public_name: str, dest_rel: str, *, crop: bool = True) -> bool:
    src = PUBLIC_ASSETS / public_name
    if not src.exists():
        print(f"SKIP public: {public_name}")
        return False
    dest = PUBLIC_PROCESSED / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    result = remove_checkerboard(Image.open(src), crop=crop)
    result.save(dest, format="PNG", optimize=True)
    print(f"OK public: {dest_rel} ({result.size[0]}x{result.size[1]}) <- {public_name}")
    return True


def main() -> None:
    count = 0

    copy_static(f"assets/{STATIC_BG}")
    copy_static("assets/worldmap.png")
    count += 2

    for name in TILE_FILES:
        src = find_tile_src(name)
        if src:
            process(src, f"tiles/{name}")
            count += 1

    for name in ACTION_FILES:
        src = find_action_src(name)
        if src:
            process(src, f"actions/{name}")
            count += 1

    for src_name, dest_rel in HUD_FILES.items():
        src = find_hud_src(src_name)
        if src:
            process(src, dest_rel)
            count += 1
        else:
            print(f"SKIP hud: {src_name}")

    card_src = find_card_src()
    if card_src:
        process(card_src, "cards/current_card.png")
        count += 1
    else:
        print("SKIP card: current_card")

    trail = ROOT / "assets" / TRAIL_OVERLAY
    if trail.exists():
        process(trail, TRAIL_OVERLAY, crop=False)
        count += 1

    for name in WORLDMAP_NODE_FILES:
        src = ROOT / "assets" / name
        if src.exists():
            process(src, f"worldmap/{name}")
            count += 1
        else:
            print(f"SKIP worldmap node: {name}")

    for public_name, dest_rel, crop in PUBLIC_WORLD_ASSETS:
        if process_public_src(public_name, dest_rel, crop=crop):
            count += 1

    for name in RESULT_ASSETS:
        if process_public_src(name, f"result/{name}", crop=False):
            count += 1

    print(f"\nDone - {count} asset(s) processed/copied.")


if __name__ == "__main__":
    main()
