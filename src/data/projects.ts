export const projects = [
  {
    slug: 'toscamare', number: '01', name: 'Toscamare', category: 'WEB CORPORATIVA', kind: 'sea',
    headline: 'Una empresa real. Una web en producción.',
    summary: 'Diseño, desarrollo y publicación de la web corporativa durante mis prácticas.',
    tags: ['Frontend', 'Diseño', 'Despliegue'],
    context: 'La presencia digital de una empresa de venta y distribución de alimentos.',
    contribution: 'Desarrollé la web corporativa y me encargué del recorrido completo, desde el diseño hasta su puesta en producción.',
    result: 'Un sitio público donde conocer la empresa y su actividad.',
    learning: 'Conectar el diseño y la implementación con la parte menos visible: hosting, dominio y publicación.',
    link: 'https://toscamare.es', linkLabel: 'Visitar Toscamare',
    note: 'Proyecto realizado durante las prácticas del ciclo de DAW en 2026.'
  },
  {
    slug: 'logistica', number: '02', name: 'Del papel al panel.', category: 'APLICACIÓN INTERNA', kind: 'logistics',
    headline: 'Los procesos cotidianos también merecen buen software.',
    summary: 'Una aplicación de gestión para entradas de mercancía, repartos y albaranes.',
    tags: ['Aplicación web', 'Base de datos', 'Digitalización'],
    context: 'El equipo registraba parte de su operativa a mano. Las entradas de mercancía y los repartos necesitaban un flujo digital.',
    contribution: 'Construí una aplicación interna de gestión con base de datos para registrar entradas, repartos y albaranes.',
    result: 'El equipo pasó a trabajar con un registro digital, facilitando la gestión y reduciendo errores de registro.',
    learning: 'Traducir una forma de trabajar real en una herramienta que el equipo pueda utilizar en su día a día.',
    link: '', linkLabel: '',
    note: 'Aplicación de uso interno, desarrollada durante las prácticas. La representación visual utiliza datos ficticios y no reproduce información de la empresa.'
  },
  {
    slug: 'fitpulse', number: '03', name: 'FitPulse', category: 'PROYECTO PERSONAL', kind: 'fitness',
    headline: 'El entrenamiento, con un lugar para cada progreso.',
    summary: 'Una aplicación para organizar rutinas, registrar entrenamientos y seguir el progreso.',
    tags: ['Astro', 'React', 'Supabase'],
    context: 'Un proyecto personal centrado en organizar la actividad del gimnasio desde una aplicación web.',
    contribution: 'El proyecto combina Astro y React con Supabase. Incluye rutinas, registro de entrenamientos, temporizador de descansos y seguimiento de récords personales.',
    result: 'Un proyecto en desarrollo que reúne el registro del entrenamiento y el seguimiento del progreso en una misma experiencia.',
    learning: 'Trabajar con interfaces de aplicación, estado y persistencia dentro de un proyecto full stack.',
    link: '', linkLabel: '',
    note: 'Proyecto personal en desarrollo. La composición del portfolio es conceptual; no es una captura de la aplicación.'
  }
] as const;

