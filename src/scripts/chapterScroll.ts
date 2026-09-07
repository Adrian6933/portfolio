/** Wheel distance needed before changing chapters; internal scenes stay continuous. */
export const CHAPTER_THRESHOLD = 180;
export function nextStop(stops: number[], y: number, direction: number) {
  return direction > 0 ? stops.find(stop => stop > y + 2) ?? stops.at(-1) ?? 0
    : [...stops].reverse().find(stop => stop < y - 2) ?? stops[0] ?? 0;
}
export function internalBoundary(top: number, end: number, y: number, direction: number) {
  if (end - top <= 2 || y < top - 2 || y > end + 2) return null;
  if (direction > 0 && y < end - 2) return end;
  if (direction < 0 && y > top + 2) return top;
  return null;
}
export function addWheelDistance(total: number, delta: number) {
  // One large wheel event must not trigger a chapter change on its own.
  return (Math.sign(total) !== Math.sign(delta) ? 0 : total) +
    Math.sign(delta) * Math.min(100, Math.abs(delta));
}
export function pipelineProgress(top: number, range: number) {
  return Math.max(0, Math.min(1, -top / Math.max(1, range)));
}

export function setupChapterScroll() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, lastWheel = 0, lockedUntil = 0, accumulated = 0;
  const enabled = () => innerWidth >= 900 && innerHeight > 520;
  const stopAnimation = () => { cancelAnimationFrame(frame); frame = 0; };
  const reset = () => { stopAnimation(); lockedUntil = 0; accumulated = 0; };
  function sections() {
    return [...document.querySelectorAll<HTMLElement>('.chapter')].map(section => {
      const top = section.getBoundingClientRect().top + scrollY;
      return { top, end: top + Math.max(0, section.offsetHeight - innerHeight) };
    });
  }
  function boundary(direction: number) {
    for (const section of sections()) {
      const edge = internalBoundary(section.top, section.end, scrollY, direction);
      if (edge !== null) return edge;
    }
    return null;
  }
  function sceneBoundary(direction: number) {
    const tolerance = 5;
    for (const section of sections()) {
      if (direction > 0 && scrollY >= section.end - tolerance && scrollY <= section.end + tolerance)
        return section.end;
      if (direction < 0 && scrollY >= section.top - tolerance && scrollY <= section.top + tolerance)
        return section.top;
    }
    return null;
  }
  function move(direction: number) {
    const maxY = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const stops = [...new Set([...sections().flatMap(s => [s.top, s.end]), maxY]
      .map(y => Math.round(Math.max(0, Math.min(maxY, y)))))].sort((a,b) => a-b);
    const from = scrollY, destination = nextStop(stops, from, direction);
    if (Math.abs(destination - from) < 2) return;
    stopAnimation();
    lockedUntil = performance.now() + 650;
    if (reduced.matches) { scrollTo({ top: destination, behavior: 'instant' }); return; }
    const started = performance.now();
    function animate(now: number) {
      const p = Math.min(1, (now - started) / 440);
      scrollTo({ top: from + (destination - from) * (1 - Math.pow(1-p,3)), behavior: 'instant' });
      frame = p < 1 ? requestAnimationFrame(animate) : 0;
    }
    frame = requestAnimationFrame(animate);
  }
  function nestedCanScroll(target: EventTarget | null, direction: number) {
    let element = target instanceof HTMLElement ? target : null;
    while (element && element !== document.body && element !== document.documentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(element).overflowY) &&
          element.scrollHeight > element.clientHeight + 1 &&
          (direction > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0)) return true;
      element = element.parentElement;
    }
    return false;
  }
  window.addEventListener('wheel', event => {
    if (!enabled() || event.ctrlKey || event.metaKey || event.shiftKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const direction = Math.sign(event.deltaY);
    if (nestedCanScroll(event.target, direction)) return;
    const now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    if (now < lockedUntil || frame || (lockedUntil > 0 && gap < 200)) { event.preventDefault(); return; }
    lockedUntil = 0;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const edge = boundary(direction);
    const finishedScene = sceneBoundary(direction);
    if (finishedScene !== null) {
      event.preventDefault();
      accumulated = addWheelDistance(accumulated, delta);
      if (Math.abs(accumulated) >= CHAPTER_THRESHOLD) {
        accumulated = 0;
        move(direction);
      }
      return;
    }
    if (edge !== null) {
      accumulated = 0;
      // Let the browser scroll normally within a scene. Clamp only its last
      // pixels so a large wheel delta cannot skip the final animation phase.
      if ((direction > 0 && scrollY + delta > edge) || (direction < 0 && scrollY + delta < edge)) {
        event.preventDefault(); scrollTo({ top: edge, behavior: 'instant' });
      }
      return;
    }
    event.preventDefault();
    if (gap > 700) accumulated = 0;
    accumulated = addWheelDistance(accumulated, delta);
    if (Math.abs(accumulated) >= CHAPTER_THRESHOLD) { accumulated = 0; move(direction); }
  }, { passive: false });
  window.addEventListener('keydown', event => {
    if (!enabled() || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, [contenteditable], [role="tab"]')) return;
    if (event.key === 'PageDown' || event.key === 'PageUp') {
      const direction = event.key === 'PageDown' ? 1 : -1;
      if (boundary(direction) !== null) { reset(); return; }
      event.preventDefault();
      if (!event.repeat && !frame) move(direction);
    } else if (['Home','End','ArrowDown','ArrowUp','Tab','Escape'].includes(event.key)) reset();
  });
  document.addEventListener('pointerdown', reset);
  window.addEventListener('touchstart', reset, { passive:true });
  window.addEventListener('resize', reset);
  reduced.addEventListener('change', reset);
}

