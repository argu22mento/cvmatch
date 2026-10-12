import { BASE_CV, OPTIMIZED_CV } from './cvData';

/** Currículum maquetado como folio A4 (o en modo lectura para pantallas pequeñas). */
export default function CvSheet({ data, optimized, refreshing, reading }) {
  const newSkills = optimized ? new Set(OPTIMIZED_CV.skills.filter((s) => !BASE_CV.skills.includes(s))) : new Set();

  return (
    <article
      aria-label="Previsualización del currículum"
      className={`a4 relative w-full max-w-full aspect-[1/1.414] bg-white rounded-md overflow-hidden transition-opacity duration-300 ${
        reading ? 'is-reading' : ''
      } ${refreshing ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="cv">
        <header className="cv-head">
          <h2 className="cv-name">{data.name}</h2>
          <p className="cv-role">{data.role}</p>
          <p className="cv-contact">{data.contact.join('  ·  ')}</p>
        </header>

        <section>
          <h3 className="cv-h">Extracto</h3>
          <p className="cv-p">{data.summary}</p>
        </section>

        <section>
          <h3 className="cv-h">Experiencia</h3>
          <div className="cv-stack">
            {data.experience.map((job) => (
              <div key={job.company}>
                <div className="cv-row">
                  <p className="cv-strong">
                    {job.title} <span className="cv-muted">· {job.company}</span>
                  </p>
                  <p className="cv-muted cv-nowrap">{job.period}</p>
                </div>
                <ul className="cv-list">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="cv-h">Educación</h3>
          <div className="cv-stack-sm">
            {data.education.map((ed) => (
              <div key={ed.title} className="cv-row">
                <p className="cv-strong">
                  {ed.title} <span className="cv-muted">· {ed.school}</span>
                </p>
                <p className="cv-muted cv-nowrap">{ed.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="cv-h">Habilidades</h3>
          <ul className="cv-skills">
            {data.skills.map((s) => (
              <li key={s} className={newSkills.has(s) ? 'is-new' : ''}>
                {s}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
