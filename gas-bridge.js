// google.script.run 어댑터: 화면 코드는 그대로 두고 GAS 서버(doPost)로 전달한다.
(function () {
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbxEpGinP9eQgu7tP89arKOf4CLyI1tzZ13GFkSrdF31CQwYc4-RiIyzEZoSdIJvT3bLpw/exec';
  var PIN_KEY = 'bizcard_pin';
  var PROTECTED = { scanBusinessCardWithGemini: 1, saveScannedCard: 1 };

  function getPin(force) {
    var pin = '';
    try { if (!force) pin = localStorage.getItem(PIN_KEY) || ''; } catch (e) {}
    if (!pin) {
      pin = window.prompt('관리자 PIN을 입력하세요') || '';
      try { if (pin) localStorage.setItem(PIN_KEY, pin); } catch (e) {}
    }
    return pin;
  }

  function call(fn, args, retried) {
    var body = { fn: fn, args: args };
    if (PROTECTED[fn]) body.pin = getPin(retried);
    return fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.text(); }).then(function (t) {
      var res;
      try { res = JSON.parse(t); } catch (e) { throw new Error('서버 응답을 해석하지 못했습니다.'); }
      if (!res.ok) {
        if (res.code === 'AUTH' && !retried) {
          try { localStorage.removeItem(PIN_KEY); } catch (e) {}
          return call(fn, args, true);
        }
        throw new Error(res.error || '서버 오류');
      }
      return res.result;
    });
  }

  function makeRunner(onOk, onFail) {
    return new Proxy({}, {
      get: function (_, name) {
        if (name === 'withSuccessHandler') return function (f) { return makeRunner(f, onFail); };
        if (name === 'withFailureHandler') return function (f) { return makeRunner(onOk, f); };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          call(String(name), args, false).then(
            function (r) { if (onOk) onOk(r); },
            function (e) { if (onFail) onFail(e); else console.error(e); }
          );
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = { run: makeRunner(null, null) };
})();
