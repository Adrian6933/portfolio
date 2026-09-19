import { useState } from 'react';
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
  return <div className={'tool-marquees' + (paused ? ' is-paused' : '')}>
    <div className="marquee-controls"><span>UN STACK, MUCHAS POSIBILIDADES</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶ Reanudar' : 'Ⅱ Pausar movimiento'}</button></div>
    {groups.map((group, i) => <div className={'tool-row row-' + i} key={group.label}>
      <p className="row-label">{group.label}</p><div className="marquee-window"><div className="marquee-track">
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

