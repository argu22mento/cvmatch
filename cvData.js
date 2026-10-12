/* Textos de ejemplo («Probar con un ejemplo») y CV de muestra que se ve antes de optimizar */

export const SAMPLE_CV = `Marta Solís Rivera
Diseñadora instruccional y desarrolladora frontend · Madrid

7 años creando cursos online y plataformas de formación. Maquetación en HTML/CSS/JavaScript, Articulate Storyline y Moodle.

Experiencia
- Formatia Learning (2021–hoy): diseño de cursos, desarrollo de interfaces para LMS.
- Aula Digital S.L. (2018–2021): maquetación de contenidos SCORM y tutoría online.

Estudios: Grado en Pedagogía (UCM). Máster en Desarrollo Web (UOC).`;

export const SAMPLE_OFFER = `Frontend Developer — Plataforma E-learning (React)
EduNova · Remoto (España)

Buscamos una persona para construir la nueva experiencia de aprendizaje de nuestra plataforma.
Requisitos: React y TypeScript, accesibilidad WCAG 2.2, experiencia con estándares SCORM/xAPI, Next.js, testing con Jest.
Valorable: conocimiento de diseño instruccional y analítica de aprendizaje.`;

export const BASE_CV = {
  name: 'Marta Solís Rivera',
  role: 'Diseñadora Instruccional & Desarrolladora Frontend',
  contact: ['marta.solis@correo.es', '+34 600 123 456', 'Madrid'],
  summary:
    'Profesional del e-learning con 7 años diseñando cursos online y maquetando las interfaces que los sirven. Combino criterio pedagógico con desarrollo web para que cada curso sea claro, medible y fácil de mantener.',
  experience: [
    {
      company: 'Formatia Learning',
      title: 'Diseñadora instruccional y frontend',
      period: '2021 — Actualidad',
      bullets: [
        'Diseño de 40+ cursos online para clientes corporativos del sector financiero.',
        'Desarrollo de componentes HTML, CSS y JavaScript para el LMS interno.',
        'Coordinación con expertos en la materia y revisión de guiones.',
      ],
    },
    {
      company: 'Aula Digital S.L.',
      title: 'Maquetadora de contenidos e-learning',
      period: '2018 — 2021',
      bullets: [
        'Maquetación de paquetes SCORM 1.2 en Articulate Storyline y Moodle.',
        'Tutoría online de grupos de hasta 60 alumnos.',
      ],
    },
  ],
  education: [
    { title: 'Máster en Desarrollo Web', school: 'Universitat Oberta de Catalunya', year: '2020' },
    { title: 'Grado en Pedagogía', school: 'Universidad Complutense de Madrid', year: '2017' },
  ],
  skills: ['HTML y CSS', 'JavaScript', 'Moodle', 'Articulate Storyline', 'SCORM 1.2', 'Diseño instruccional', 'Figma'],
};
