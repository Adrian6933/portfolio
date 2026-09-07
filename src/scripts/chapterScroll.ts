/**
 * One wheel gesture advances one scene. Native touch scrolling, zoom and
 * nested scroll containers remain available.
 */
export function nextStop(stops: number[], y: number, direction: number) {
  return direction > 0
    ? stops.find(stop => stop > y + 8) ?? stops[stops.length - 1] ?? 0
    : [...stops].reverse().find(stop => stop < y - 8) ?? stops[0] ?? 0;
}

export function setupChapterScroll() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastWheel = 0;
  let lockedUntil = 0;
  let accumulated = 0;
  let previousDirection = 0;
  const enabled = () => innerWidth >= 900 && innerHeight > 520;
  const stopAnimation = () => { cancelAnimationFrame(frame); frame = 0; };

  function stops() {
    const positions: number[] = [];
    const maxY = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    document.querySelectorAll<HTMLElement>('.chapter').forEach(section => {
      const top = section.getBoundingClientRect().top + scrollY;
      const range = Math.max(0, section.offsetHeight - innerHeight);
      positions.push(top);
      if (section.id === 'proyectos' && section.classList.contains('scroll-enhanced')) {
        const track = section.querySelector<HTMLElement>('.projects-track');
        const viewport = section.querySelector<HTMLElement>('.projects-viewport');
        if (track && viewport) {
          const travel = Math.max(1, track.scrollWidth - viewport.clientWidth);
          track.querySelectorAll<HTMLElement>('.project-card').forEach(card =>
            positions.push(top + Math.min(1, card.offsetLeft / travel) * range));
        }
      } else if (section.id === 'fullstack' && !reduced.matches) {
        for (let i = 1; i <= 3; i++) positions.push(top + range * i / 3);
      } else if (range > 8) {
        // Oversized sections (including enlarged text) stay fully readable.
        for (let offset = innerHeight * .85; offset < range; offset += innerHeight * .85)
          positions.push(top + offset);
        positions.push(top + range);
      }
    });
    positions.push(maxY);
    return [...new Set(positions.map(y => Math.round(Math.max(0, Math.min(maxY, y)))))].sort((a, b) => a - b);
  }

  function move(direction: number) {
    const from = scrollY;
    const destination = nextStop(stops(), from, direction);
    if (Math.abs(destination - from) < 2) return;
    stopAnimation();
    lockedUntil = performance.now() + 650;
    if (reduced.matches) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      return;
    }
    const started = performance.now();
    function animate(now: number) {
      const p = Math.min(1, (now - started) / 440);
      const eased = 1 - Math.pow(1 - p, 3);
      window.scrollTo({ top: from + (destination - from) * eased, behavior: 'instant' });
      if (p < 1) frame = requestAnimationFrame(animate); else frame = 0;
    }
    frame = requestAnimationFrame(animate);
  }

  function nestedCanScroll(target: EventTarget | null, direction: number) {
    let element = target instanceof HTMLElement ? target : null;
    while (element && element !== document.body && element !== document.documentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(element).overflowY) &&
          element.scrollHeight > element.clientHeight + 1 &&
          (direction > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0))
        return true;
      element = element.parentElement;
    }
    return false;
  }

  window.addEventListener('wheel', event => {
    if (!enabled() || event.ctrlKey || event.metaKey || event.shiftKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const direction = Math.sign(event.deltaY);
    if (nestedCanScroll(event.target, direction)) return;
    event.preventDefault();
    const now = performance.now();
    const quiet = now - lastWheel > 200;
    lastWheel = now;
    // Absorb inertia from the same gesture instead of skipping several scenes.
    if (now < lockedUntil || frame || (!quiet && lockedUntil > 0)) return;
    if (quiet) { accumulated = 0; lockedUntil = 0; }
    if (direction !== previousDirection) accumulated = 0;
    previousDirection = direction;
    accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (Math.abs(accumulated) < 14) return;
    accumulated = 0;
    move(direction);
  }, { passive: false });

  window.addEventListener('keydown', event => {
    if (!enabled() || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('input, textarea, select, button, [contenteditable], [role="tab"]')) return;
    if (event.key === 'PageDown' || event.key === 'PageUp') {
      event.preventDefault();
      if (!event.repeat && !frame) move(event.key === 'PageDown' ? 1 : -1);
    } else if (['Home', 'End', 'ArrowDown', 'ArrowUp', 'Tab', 'Escape'].includes(event.key)) {
      stopAnimation(); lockedUntil = 0;
    }
  });
  document.addEventListener('pointerdown', () => { stopAnimation(); lockedUntil = 0; });
  window.addEventListener('touchstart', stopAnimation, { passive: true });
  window.addEventListener('resize', stopAnimation);
  reduced.addEventListener('change', stopAnimation);
}

