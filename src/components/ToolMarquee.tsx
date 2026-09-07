import { useState } from 'react';
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
      {[false, true].map(clone => <div className="marquee-group" key={String(clone)} aria-hidden={clone || undefined}>{group.items.map((name, index) => <span className="tech-item" key={name}><span className={'tech-symbol symbol-' + index}>{['✳', '↗', '{ }', '≈', '⌘', '< >', '▦', '⊞', '◉', '◇'][index]}</span>{name}</span>)}</div>)}
      </div></div>
    </div>)}
  </div>;
}

