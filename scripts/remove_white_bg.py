"""
정수 동굴 노드/트레일 에셋의 흰 배경을 투명 처리한다.

원본(흰 배경, colorType RGB)은 assets/ 에 두고,
테두리(4코너)에서 flood-fill로 배경 흰색만 제거한 뒤
public/assets/ 에 RGBA(투명) PNG로 저장한다.

내부 크림색 타일/길 표면은 어두운 수정·바위 테두리로 둘러싸여 있어
테두리 flood-fill이 닿지 못하므로 보존된다.

실행: python scripts/remove_white_bg.py
"""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
DST = ROOT / "public" / "assets"

# 흰 배경을 제거할 대상 (노드 3종 + 트레일)
TARGETS = [
    "integer-cave-node-open",
    "integer-cave-node-locked",
    "integer-cave-node-complete",
    "integer-cave-trail-overlay",
]

SENTINEL = (255, 0, 255)
# floodfill 임계값: 코너 흰색과의 채널 절대차 합. 크림색 타일(차이 ~100)은 보존.
THRESH = 95


def process(name: str) -> None:
    src = SRC / f"{name}.png"
    dst = DST / f"{name}.png"
    im = Image.open(src).convert("RGB")
    w, h = im.size

    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(im, seed, SENTINEL, thresh=THRESH)

    rgba = im.convert("RGBA")
    pixels = list(rgba.getdata())
    out = []
    cleared = 0
    for r, g, b, _ in pixels:
        if (r, g, b) == SENTINEL:
            out.append((0, 0, 0, 0))
            cleared += 1
        else:
            out.append((r, g, b, 255))
    rgba.putdata(out)
    rgba.save(dst)

    pct = cleared / (w * h) * 100
    print(f"  {name}: {w}x{h}  투명화 {pct:.1f}%  -> {dst.relative_to(ROOT)}")


def main() -> None:
    print("정수 동굴 에셋 흰 배경 제거:")
    for name in TARGETS:
        process(name)
    print("완료.")


if __name__ == "__main__":
    main()
