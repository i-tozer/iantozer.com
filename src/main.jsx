import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function installWheelScrollRescue() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__TOZER_WHEEL_SCROLL_RESCUE_INSTALLED__) return;
  window.__TOZER_WHEEL_SCROLL_RESCUE_INSTALLED__ = true;

  const scrollingElement = () => document.scrollingElement || document.documentElement;

  const getNearestScrollableAncestor = (start) => {
    let el = start instanceof Element ? start : null;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const canScrollY =
        (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
        el.scrollHeight > el.clientHeight + 1;
      if (canScrollY) return el;
      el = el.parentElement;
    }
    return scrollingElement();
  };

  window.addEventListener(
    'wheel',
    (e) => {
      // Ignore pinch-to-zoom (trackpad) gestures on macOS and similar.
      if (e.ctrlKey) return;

      const docEl = scrollingElement();
      const startDocTop = docEl.scrollTop;

      const scrollAncestor = getNearestScrollableAncestor(e.target);
      const startAncestorTop =
        scrollAncestor === docEl ? startDocTop : scrollAncestor.scrollTop;

      requestAnimationFrame(() => {
        const endDocTop = docEl.scrollTop;
        const endAncestorTop =
          scrollAncestor === docEl ? endDocTop : scrollAncestor.scrollTop;

        // If something (document or a nested scroller) actually scrolled, do nothing.
        if (endDocTop !== startDocTop || endAncestorTop !== startAncestorTop) return;

        // If the document can't scroll, nothing to do.
        const maxScroll = docEl.scrollHeight - docEl.clientHeight;
        if (maxScroll <= 0) return;

        // Normalize wheel deltas to pixels.
        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16; // lines -> px (approx)
        if (e.deltaMode === 2) dy *= window.innerHeight; // pages -> px

        window.scrollBy({ top: dy, left: 0, behavior: 'auto' });
      });
    },
    { passive: true },
  );
}

installWheelScrollRescue();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
