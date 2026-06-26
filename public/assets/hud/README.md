# HUD 에셋

플레이 화면 HUD 프레임용 PNG 원본은 이 폴더에 둡니다.  
게임에서는 `public/assets/processed/hud/` (배경 제거본)을 사용합니다.

| 파일명 | 용도 |
|--------|------|
| `hud-help-button.png` | 도움말 버튼 |
| `hud-settings-button.png` | 설정 버튼 |
| `hud-score-panel.png` | 점수 패널 |
| `hud-round-pill.png` | 라운드 표시 |
| `hud-timer-panel.png` | 타이머 패널 |
| `current-card-panel-frame-v2.png` | 현재 카드 프레임 |

배경 제거:

```bash
python scripts/process_hud_assets.py
```

상수: `src/assets/hudAssets.ts` → `/assets/processed/hud/...`
