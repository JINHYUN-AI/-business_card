# 전자명함 (장진현) — https://card.jinhyun.ai.kr
- `/`      : 받는 사람용 전자명함 (연락처 저장, 전화/문자/메일, QR)
- `/s/`    : 문자·카톡에 넣는 짧은 링크 (열리면 내 연락처 파일 자동 내려받기)
- `/scan/` : 명함 스캐너 앱 (관리자 PIN 필요, AI OCR → 폰 연락처/시트 저장 → 내 명함 보내기)
- `/card/` : 예전 주소 호환
- 백엔드: Google Apps Script (`39. 전자명함` 폴더, `gas-bridge.js`가 호출)
- 화면 원본은 GAS 폴더의 `index.html`이며 `프론트빌드.cjs`로 이 저장소 화면을 생성한다.
- 도메인: 가비아 DNS의 CNAME `card` → `jinhyun-ai.github.io.`
