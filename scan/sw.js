// 설치(PWA) 조건용 최소 서비스 워커: 화면을 캐시하지 않으므로 수정 내용이 바로 반영된다.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* 네트워크 그대로 사용 */ });
