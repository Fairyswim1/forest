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

## 성취기준 확인

게임의 `성취기준 확인 · 기록`에서 독립 확인 과제, 도움/재시도 구분, 학생 설명과 교사 검토, JSON 내보내기·인쇄를 제공합니다. 기준·범위·출처는 `assessment.json`에 있습니다. 기록은 해당 기기의 브라우저에만 저장되며 게임 점수와 별개입니다. 공식 이수나 성적을 자동 판정하지 않습니다. 학교 평가와 함께 사용할 형성평가 증거입니다.

## 공통 게임 서체

넘버 트레일·넘버 브레이크를 기준으로 제목 Jua, 버튼·숫자 Do Hyeon, 설명 Gowun Dodum의 역할을 사용합니다. 기존 두 게임의 고유 화면은 유지하고 추가 학습 화면에도 같은 서체를 적용합니다. WOFF2 글꼴과 SIL OFL 라이선스는 `public/theme/fonts/`에 포함되어 있습니다. 원본 출처와 변환 정보는 `SOURCES.txt`를 참고하세요.
