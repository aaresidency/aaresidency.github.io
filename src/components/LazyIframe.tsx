import { useEffect, useRef, useState, type IframeHTMLAttributes } from 'react'

/**
 * Mounts the iframe only once it is about to scroll into view. `loading="lazy"` alone still fetches
 * embeds like Google Maps (~700 KB) on short pages, so this keeps them off the critical load.
 */
export function LazyIframe(props: IframeHTMLAttributes<HTMLIFrameElement> & { title: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      queueMicrotask(() => setVisible(true)) // very old browsers: just load it
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={box} className="w-full h-full">{visible && <iframe {...props} />}</div>
}
