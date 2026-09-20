import { useRef, useState } from 'react';
import {
  siReact, siAstro, siTypescript, siTailwindcss, siJavascript, siHtml5,
  siBootstrap, siShopify, siNodedotjs, siLaravel, siPython, siSupabase,
  siMysql, siMongodb, siFirebase, siSqlite, siOpenjdk,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
 
const iconByName: Record<string, SimpleIcon | undefined> = {
  React: siReact, Astro: siAstro, TypeScript: siTypescript, 'Tailwind CSS': siTailwindcss,
  JavaScript: siJavascript, 'HTML / CSS': siHtml5, Bootstrap: siBootstrap, Shopify: siShopify,
  'Node.js': siNodedotjs, Laravel: siLaravel, Java: siOpenjdk, Python: siPython,
  Supabase: siSupabase, MySQL: siMysql, MongoDB: siMongodb, Firebase: siFirebase, SQLite: siSqlite,
};
const groups = [
  { label: 'FRONTEND', items: ['React', 'Astro', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML / CSS', 'Bootstrap', 'Shopify'] },
  { label: 'BACKEND & DATOS', items: ['Node.js', 'Laravel', 'Java', 'Python', 'Supabase', 'MySQL', 'MongoDB', 'Firebase', 'Oracle', 'SQLite'] },
];
export default function ToolMarquee() {
  const [paused, setPaused] = useState(false);
  const tracks = useRef<Array<HTMLDivElement | null>>([]);
  const playbackRates = useRef([1, 1]);
  const animationFrame = useRef<number | null>(null);

  const setRowSpeed = (index: number, targetRate: number) => {
    const animation = tracks.current[index]?.getAnimations()[0];
    if (!animation) return;
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);

    const initialRate = playbackRates.current[index] ?? 1;
    const startedAt = performance.now();
    const duration = 320;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const rate = initialRate + (targetRate - initialRate) * eased;
      animation.playbackRate = rate;
      playbackRates.current[index] = rate;
      if (progress < 1) animationFrame.current = requestAnimationFrame(tick);
      else animationFrame.current = null;
    };
    animationFrame.current = requestAnimationFrame(tick);
  };

  return <div className={'tool-marquees' + (paused ? ' is-paused' : '')}>
    <div className="marquee-controls"><span>UN STACK, MUCHAS POSIBILIDADES</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶ Reanudar' : 'Ⅱ Pausar movimiento'}</button></div>
    {groups.map((group, i) => <div className={'tool-row row-' + i} key={group.label} onMouseEnter={() => setRowSpeed(i, 0.38)} onMouseLeave={() => setRowSpeed(i, 1)}>
      <p className="row-label">{group.label}</p><div className="marquee-window"><div className="marquee-track" ref={element => { tracks.current[i] = element; }}>
      {[0, 1, 2].map(clone => <div className="marquee-group" key={clone} aria-hidden={clone > 0 || undefined}>{group.items.map(name => {
        const icon = iconByName[name];
        return <span className="tech-item" key={name}>
          <span className="tech-symbol" style={icon ? { color: '#' + icon.hex } : undefined} aria-hidden="true">
            {icon ? <svg viewBox="0 0 24 24" role="img"><path d={icon.path} /></svg> : <b>{name.slice(0, 2).toUpperCase()}</b>}
          </span>{name}
        </span>;
      })}</div>)}
      </div></div>
    </div>)}
  </div>;
}

