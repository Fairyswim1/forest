# 넘버 트레일 : 수의 모험

PC 웹 수학 보드게임 (React + Vite)

## 프로젝트 경로 (본진)

`C:\coding\forest`

> `streams` 폴더는 이전 작업 복제본입니다. 앞으로는 **forest**만 사용하세요.

## 에셋

**원본:** `public/assets/` — 월드별 PNG를 여기에 추가

**게임용 (체크무늬 제거·투명 PNG):** `public/assets/processed/`

```powershell
cd C:\coding\forest
npm run process-tiles
```

## 실행

```powershell
cd C:\coding\forest
npm install
npm run dev
```

## 월드 (통합 월드맵)

1. 자연수의 숲 (`natural-1-1`)
2. 정수의 동굴 (`integer-1-1`)
3. 유리수의 초원 (`rational-1-1`)
4. 실수의 별빛 우주 (`real-1-1`)

해금 순서: natural → integer → rational → real

## 설정

- 타일 번호 표시: 개발 모드에서만 (`SHOW_TILE_INDEX`)
- 고정 덱 테스트: `?deck=fixed` (개발 모드)

## 오디오

월드별 CC0 BGM·효과음: `public/assets/audio/` (출처는 `CREDITS.txt`)
월드맵 메뉴에서 소리 켜기/끄기 가능.
