import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Smart device model extraction from Android UA fragments
function extractAndroidModel(ua) {
  // Pattern 1: "Android X; <locale>; <Model> Build/" — most common, most reliable
  let m = ua.match(/;\s*([^;)]+?)\s+Build\/([^\s;)]+)/)
  if (m) return cleanModel(m[1])

  // Pattern 2: "Android X.X; <Model> Build/" — no locale
  m = ua.match(/Android\s+[\d.]+;\s*([^;)]+?)\s+Build\//)
  if (m) return cleanModel(m[1])

  // Pattern 3: "Linux; Android X; <locale>; <Model> Build/" — common in WebView
  m = ua.match(/Android\s+\d+;\s*[^;]*?;\s*([^;)]+?)\s+Build\//)
  if (m) return cleanModel(m[1])

  // Pattern 4: Just "<Model> Build/" with leading semicolon
  m = ua.match(/;\s*([A-Z]{2,4}[\s-]?[\w-]+)\s+Build\//)
  if (m) return cleanModel(m[1])

  // Pattern 5: Parenthesized group without Build: "Android X; <Model>)"
  m = ua.match(/Android\s+[\d.]+;\s*([^;)]+?)\)/)
  if (m) return cleanModel(m[1])

  // Pattern 6: After language tag: "zh-CN; <Model>)"
  m = ua.match(/;\s*(?:zh|en|ja|ko|fr|de|es|pt|ru|ar|th|vi|in|ms|tr|it|nl|pl)[_-]\w+;\s*([^;)]+?)\)/)
  if (m) return cleanModel(m[1])

  return ''
}

function cleanModel(raw) {
  if (!raw) return ''
  raw = raw.trim()
  // Exclude non-model tokens
  const noise = /^(Linux|Android|wv|WV|Mobile|WAP|NetType|Language|ABI|AppleWebKit|KHTML|Gecko|Version|Chrome|Safari|XWEB|MMWEBSDK|MMWEBID|MicroMessenger|WeChat|Weixin|Dalvik|en|zh|ja|ko|fr|de|es|pt|ru|ar|th|vi|in|ms|tr|it|nl|pl|[A-Z]{2}|K|Mozilla)$/
  if (noise.test(raw)) return ''
  // Filter out things that look like build IDs or version strings
  if (/^[A-Z]+\d{5,}/.test(raw)) return '' // e.g. UP1A231005007
  if (/^\d+$/.test(raw)) return ''
  return raw
}

function detectBrand(ua, model) {
  if (model && model.length > 0) return model // already have a specific model

  // Huawei / Honor
  if (/HUAWEI|HONOR|HW-|EMUI|HarmonyOS|OpenHarmony|(?:_|\s)HW(?:_|\s)/i.test(ua))
    return '华为设备'
  if (/AL[NP]-\w|ANA-|BLA-|CLT-|ELE-|EVA-|JNY-|LIO-|NOH-|OCE-|PCT-|TAS-|VOG-|YAL-/i.test(ua))
    return '华为设备'

  // Xiaomi / Redmi / POCO
  if (/Xiaomi|Redmi|POCO|MI \d|Mi \d|M200[0-9]|M210[0-9]|M201[0-9]/i.test(ua))
    return '小米设备'

  // OPPO / OnePlus
  if (/OPPO|OnePlus|CPH\d|PG[AE]M|PH[ABW]|RMX\d|REA\d|PK[AG]/i.test(ua))
    return 'OPPO/一加设备'

  // vivo / iQOO
  if (/vivo|V\d{4}|iQOO|I\d{4}/i.test(ua))
    return 'vivo设备'

  // Samsung
  if (/Samsung|SM-[A-Z]\d|GT-[A-Z]\d|SC-[A-Z]\d|SCH-[A-Z]\d|SGH-[A-Z]\d|SHV-[A-Z]\d|SHW-[A-Z]\d/i.test(ua))
    return '三星设备'

  // Google Pixel
  if (/Pixel\s?\d|Pixel [A-Z]/i.test(ua)) return 'Google Pixel'

  // Motorola / Lenovo
  if (/motorola|Moto\s|XT\d{4}|moto\s|Lenovo|TB-/i.test(ua))
    return '摩托罗拉/联想设备'

  // Meizu
  if (/Meizu|M\d{3}[A-Z]|m\d\snote/i.test(ua))
    return '魅族设备'

  // ZTE / Nubia
  if (/ZTE|Nubia|NX\d{3}/i.test(ua))
    return '中兴/努比亚设备'

  // Realme
  if (/Realme|realme|RMX\d/i.test(ua))
    return 'realme设备'

  // Generic fallback for identifiable Android devices
  if (/Android.*(?:Build|Mobile)/i.test(ua))
    return '安卓手机'

  return ''
}

async function parseUA(ua) {
  let browser = '其他'
  let os = '其他'
  let device = '桌面端'
  let model = ''

  // ── Step 1: Try User-Agent Client Hints for accurate Windows version ──
  if (/Windows NT 10\.0/i.test(ua)) {
    try {
      if (navigator.userAgentData) {
        const hints = await navigator.userAgentData.getHighEntropyValues(['platformVersion'])
        const ver = parseFloat(hints.platformVersion) || 0
        os = ver >= 13 ? 'Windows 11' : 'Windows 10'
      }
    } catch (_) { /* fall through to UA fallback */ }
    if (os === '其他') os = 'Windows 10/11'
  }

  // ── Step 2: UA-based OS detection (for non-Windows or as fallback) ──
  if (os === '其他') {
    if (ua.includes('HarmonyOS') || ua.includes('OpenHarmony')) {
      os = 'HarmonyOS'; device = '手机'
    } else if (ua.includes('iPhone')) {
      os = 'iOS'; device = '手机'; model = 'iPhone'
    } else if (ua.includes('iPad')) {
      os = 'iPadOS'; device = '平板'; model = 'iPad'
    } else if (ua.includes('Android')) {
      os = 'Android'
      device = /Mobile|wv/i.test(ua) ? '手机' : '平板'
      model = extractAndroidModel(ua)
      model = detectBrand(ua, model)
    } else if (ua.includes('Windows NT 10.0')) {
      os = 'Windows 10/11' // couldn't determine via UA-CH
    } else if (ua.includes('Windows NT 6.3')) {
      os = 'Windows 8.1'
    } else if (ua.includes('Windows NT 6.1')) {
      os = 'Windows 7'
    } else if (ua.includes('Windows')) {
      os = 'Windows'
    } else if (ua.includes('Mac OS X') || ua.includes('macOS')) {
      os = 'macOS'
    } else if (ua.includes('Linux') && !ua.includes('Android')) {
      os = 'Linux'
    } else if (ua.includes('CrOS')) {
      os = 'ChromeOS'
    }
  } else {
    // OS was set via UA-CH, fill in device if needed
    if (ua.includes('HarmonyOS') || ua.includes('OpenHarmony')) {
      device = '手机'
    } else if (ua.includes('iPhone')) {
      os = 'iOS'; device = '手机'; model = 'iPhone'
    } else if (ua.includes('iPad')) {
      os = 'iPadOS'; device = '平板'; model = 'iPad'
    } else if (ua.includes('Android')) {
      device = /Mobile|wv/i.test(ua) ? '手机' : '平板'
      model = extractAndroidModel(ua)
      model = detectBrand(ua, model)
    }
  }

  // ── Step 3: Browser detection (embedded browsers BEFORE generic) ──
  if (ua.includes('MicroMessenger') || ua.includes('WeChat/') || ua.includes('Weixin') || ua.includes('MMWEBSDK')) {
    browser = '微信内置'
  } else if (ua.includes('QQ/') || ua.includes('MQQBrowser') || ua.includes('QQBrowser')) {
    browser = 'QQ浏览器'
  } else if (ua.includes('UCBrowser') || ua.includes('UCWEB') || ua.includes('U3')) {
    browser = 'UC浏览器'
  } else if (ua.includes('ArkWeb') || ua.includes('HuaweiBrowser')) {
    browser = '华为浏览器'
  } else if (ua.includes('Baidu') || ua.includes('baiduboxapp') || ua.includes('BIDUBrowser')) {
    browser = '百度浏览器'
  } else if (ua.includes('DingTalk') || ua.includes('AliApp(DingTalk')) {
    browser = '钉钉'
  } else if (ua.includes('AlipayClient') || ua.includes('AlipayDefined')) {
    browser = '支付宝'
  } else if (ua.includes('Toutiao') || ua.includes('NewsArticle')) {
    browser = '今日头条'
  } else if (ua.includes('Douyin') || ua.includes('aweme')) {
    browser = '抖音'
  } else if (ua.includes('Edg/') || ua.includes('Edge/')) {
    browser = 'Edge'
  } else if (ua.includes('Firefox/') || ua.includes('FxiOS/')) {
    browser = 'Firefox'
  } else if (ua.includes('OPR/') || ua.includes('Opera') || ua.includes('OPiOS/')) {
    browser = 'Opera'
  } else if (ua.includes('SamsungBrowser')) {
    browser = '三星浏览器'
  } else if (ua.includes('MiuiBrowser')) {
    browser = '小米浏览器'
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome'
  } else if (ua.includes('Safari/') && !ua.includes('Chrome') && !ua.includes('Android')) {
    browser = 'Safari'
  }

  return { browser, os, device, model }
}

export default function useVisit() {
  const location = useLocation()
  useEffect(() => {
    let cancelled = false
    const ua = navigator.userAgent
    parseUA(ua).then(info => {
      if (cancelled) return
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: location.pathname,
          referrer: document.referrer || '',
          userAgent: ua,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          browser: info.browser,
          os: info.os,
          device: info.device,
          model: info.model,
        })
      }).catch(() => {})
    })
    return () => { cancelled = true }
  }, [location.pathname])
}
