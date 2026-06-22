# 넘버 트레일 : 수의 모험

PC 웹 수학 보드게임 (React + Vite)

## 프로젝트 경로

`C:\coding\streams`

## 에셋

**원본:** `assets/` 폴더 (프로젝트 루트)

- `empty_tile.png` — 빈 돌 타일
- `selected_tile.png` — 선택된 타일
- `placed_tile.png` — 배치 스타일 참고용
- `success_tile.png` — 성공 스타일 참고용

**게임용 (체크무늬 제거·투명 PNG):** `assets/tiles/` → `public/assets/tiles/` (`/assets/tiles/...`)

원본을 교체한 뒤 전처리:

```powershell
cd C:\coding\streams
pip install pillow numpy
python scripts/remove_checkerboard.py
```

또는 `npm run process-tiles` (Pillow 필요)

## 실행

```powershell
cd C:\coding\streams
npm install
npm run dev
```

또는 `start.bat` 더블클릭 → http://localhost:5173/

## 화면

1. **월드맵** — 수의 숲, 1-1 클릭
2. **플레이** — 스네이크형 20칸 오솔길, 투명 타일 PNG, 하단 컨트롤 바

## 설정

- 타일 번호 표시: 개발 모드(`npm run dev`)에서만 자동 표시 (`SHOW_TILE_INDEX`)
