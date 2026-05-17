import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useVisit() {
  const location = useLocation()
  useEffect(() => {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: location.pathname,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
      })
    }).catch(() => {})
  }, [location.pathname])
}
