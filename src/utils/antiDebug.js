/* eslint-disable */
// كود مشوش لمنع التفتيش وإيقاف أدوات المطور

(function() {
  // كود مشوش لمنع تتبعه بسهولة
  var _0x1a2b = [
    'devtool', 'isOpen', 'constructor', 'prototype', 'toString', 'log',
    'warn', 'debug', 'info', 'error', 'exception', 'trace',
    'apply', 'call', 'bind', 'getOwnPropertyDescriptor', 'defineProperty',
    'addEventListener', 'removeEventListener', 'dispatchEvent',
    'querySelector', 'querySelectorAll', 'getElementById',
    'createElement', 'createEvent', 'location', 'reload',
    'href', 'src', 'style', 'display', 'none', 'block'
  ];
  
  // منع الوصول إلى وحدة التحكم
  function _0xabc123() {
    var _0x5678d = {
      message: 'محاولة غير مصرح بها للوصول إلى موارد المطور'
    };
    
    // إعادة تعريف وظائف وحدة التحكم
    function _0x9876e() {
      var _0xdef54 = {};
      var _console = window.console;
      for (var i = 0; i < _0x1a2b.length; i++) {
        if (typeof _console[_0x1a2b[i]] === 'function') {
          _xdef54[_0x1a2b[i]] = _console[_0x1a2b[i]];
          _console[_0x1a2b[i]] = function() {
            if (/(chrome|firefox|safari).*devtools/i.test(navigator.userAgent)) {
              window.location.href = window.location.origin;
            }
            return;
          };
        }
      }
    }
    
    // كشف أدوات المطور
    function _0x1234f() {
      var r = false;
      var _0x4321g = function() {
        var d = new Date();
        debugger;
        return new Date() - d > 100;
      };
      
      setInterval(function() {
        r = _0x4321g() || window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200;
        if (r) {
          document.body.innerHTML = '<h1 style="text-align:center;margin-top:20%">تم اكتشاف محاولة تفتيش الموقع</h1>';
        }
      }, 1000);
    }
    
    // منع النقر بزر الماوس الأيمن
    function _0x7890h() {
      document.oncontextmenu = function(e) {
        e.preventDefault();
        return false;
      };
    }
    
    // منع اختصارات لوحة المفاتيح
    function _0x5432i() {
      document.onkeydown = function(e) {
        if (
          // F12
          e.keyCode === 123 || 
          // Ctrl+Shift+I
          (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
          // Ctrl+Shift+J
          (e.ctrlKey && e.shiftKey && e.keyCode === 74) || 
          // Ctrl+Shift+C
          (e.ctrlKey && e.shiftKey && e.keyCode === 67) || 
          // Ctrl+U
          (e.ctrlKey && e.keyCode === 85)
        ) {
          e.preventDefault();
          return false;
        }
      };
    }
    
    // رصد أحداث DevTools
    function _0x2109j() {
      window.addEventListener('devtoolschange', function(e) {
        if (e.detail.isOpen) {
          document.body.innerHTML = '';
        }
      });
    }
    
    // تنفيذ الوظائف
    _0x9876e();
    _0x1234f();
    _0x7890h();
    _0x5432i();
    _0x2109j();
  }
  
  // تنفيذ آلية الحماية عند تحميل الصفحة
  if (typeof window !== 'undefined') {
    window.addEventListener('load', _0xabc123);
  }
})();

// كشف إضافي لأدوات المطور
(function() {
  let devtools = {
    isOpen: false,
    orientation: undefined
  };
  
  const threshold = 160;
  
  const emitEvent = (isOpen, orientation) => {
    window.dispatchEvent(new CustomEvent('devtoolschange', {
      detail: {
        isOpen,
        orientation
      }
    }));
  };
  
  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';
    
    if (
      !(heightThreshold && widthThreshold) &&
      ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
    ) {
      if (!devtools.isOpen || devtools.orientation !== orientation) {
        emitEvent(true, orientation);
      }
      
      devtools.isOpen = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.isOpen) {
        emitEvent(false, undefined);
      }
      
      devtools.isOpen = false;
      devtools.orientation = undefined;
    }
  }, 500);
})();

export default function initAntiDebug() {
  // تعريف وظيفة تصدير صورية لإخفاء الهدف الحقيقي للملف
  console.log('Security module initialized');
} 
