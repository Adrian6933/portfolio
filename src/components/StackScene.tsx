import { useEffect, useRef, useState } from 'react';
const layers = [
  { n: '01', title: 'Frontend', subtitle: 'Lo que ves. Lo que usas.', tools: 'React · Astro · TypeScript · Tailwind', description: 'Interfaces claras para convertir una necesidad en una experiencia que se pueda usar.' },
  { n: '02', title: 'Backend', subtitle: 'La lógica que lo conecta.', tools: 'Node.js · PHP / Laravel · Java', description: 'La parte que procesa las acciones y conecta la interfaz con los datos de la aplicación.' },
  { n: '03', title: 'Base de datos', subtitle: 'Cada dato en su lugar.', tools: 'SQL · MySQL · Oracle · Supabase', description: 'Datos organizados para registrar, consultar y dar continuidad a los procesos.' },
  { n: '04', title: 'Despliegue', subtitle: 'Del código al mundo real.', tools: 'Linux · Git · Cloudflare · Hosting', description: 'Dominio, hosting y publicación. El proyecto termina cuando puede utilizarse.' },
];
export default function StackScene() {
  const [active, setActive] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = document.getElementById('fullstack');
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduce.matches || window.innerWidth < 900 || window.innerHeight <= 520) return;
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, range)));
      setActive(Math.min(3, Math.floor(p * 4)));
      sceneRef.current?.style.setProperty('--spread', String(32 + p * 44));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduce.addEventListener('change', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); reduce.removeEventListener('change', schedule); cancelAnimationFrame(frame); };
  }, []);
  return <div className="stack-experience">
    <div className="stack-copy">
      <p className="eyebrow muted-light">03 / CONECTAR LAS PIEZAS</p>
      <h2>La superficie<br />es solo<br /><em>el principio.</em></h2>
      <p className="stack-intro">Pienso en la aplicación completa.<br />Y trabajo en cada una de sus capas.</p>
      <div className="layer-tabs" role="tablist" aria-label="Capas de una aplicación">
        {layers.map((layer, i) => <button key={layer.n} id={'layer-tab-' + i} role="tab" aria-selected={active === i} aria-controls="layer-description" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
          let next = i;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % layers.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + layers.length - 1) % layers.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = layers.length - 1;
          else return;
          e.preventDefault(); setActive(next); document.getElementById('layer-tab-' + next)?.focus();
        }}><span>{layer.n}</span>{layer.title}</button>)}
      </div>
      <div className="layer-description" id="layer-description" role="tabpanel" aria-labelledby={'layer-tab-' + active}>
        <h3>{layers[active].subtitle}</h3><p>{layers[active].description}</p><span>{layers[active].tools}</span>
      </div>
    </div>
    <div className="stack-diagram" ref={sceneRef} data-active={active} aria-label="Diagrama de las cuatro capas de una aplicación">
      <div className="diagram-coordinate coord-top">APLICACIÓN / VISTA POR CAPAS</div>
      <div className="stack-platform">
        {layers.map((layer, i) => <div key={layer.n} className={'architecture-layer ' + (active === i ? 'selected' : '')} style={{ '--i': i } as React.CSSProperties}>
          <div className="architecture-title"><span>{layer.n} / {layer.title}</span><span>{active === i ? '●' : '○'}</span></div>
          {i === 0 ? <div className="mini-interface"><div className="mini-nav"></div><div className="mini-content"><div></div><span></span><span></span><span></span></div></div> : i === 1 ? <div className="code-lines"><p><i>async</i> function processEntry() {'{'}</p><p>  <i>const</i> result = <i>await</i> save(data);</p><p>  <i>return</i> result;</p><p>{'}'}</p></div> : i === 2 ? <div className="data-schema"><span>entradas</span><b>↔</b><span>repartos</span><b>↔</b><span>albaranes</span></div> : <div className="deploy-line"><span>commit</span><b>→</b><span>build</span><b>→</b><span className="live-node">online ●</span></div>}
        </div>)}
      </div>
      <div className="diagram-coordinate coord-bottom"><span>FRONTEND → PRODUCCIÓN</span><span>FULL STACK ↗</span></div>
    </div>
  </div>;
}


