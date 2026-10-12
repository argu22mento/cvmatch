/** Currículum maquetado como folio A4 (o en modo lectura para pantallas pequeñas).
 *  Si el contenido no cabe en un folio, el papel crece en vez de cortar el texto. */
export default function CvSheet({ data, refreshing, reading }) {
  const highlighted = new Set((data.highlightedSkills || []).map((s) => s.toLowerCase()));

  return (
    <article
      aria-label="Previsualización del currículum"
      className={`a4 relative w-full max-w-full aspect-[1/1.414] bg-white rounded-md transition-opacity duration-300 ${
        reading ? 'is-reading' : ''
      } ${refreshing ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="cv">
        <header className="cv-head">
          <h2 className="cv-name">{data.name}</h2>
          {data.role && <p className="cv-role">{data.role}</p>}
          {data.contact?.length > 0 && <p className="cv-contact">{data.contact.join('  ·  ')}</p>}
        </header>

        {data.summary && (
          <section>
            <h3 className="cv-h">Extracto</h3>
            <p className="cv-p">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <h3 className="cv-h">Experiencia</h3>
            <div className="cv-stack">
              {data.experience.map((job, i) => (
                <div key={i}>
                  <div className="cv-row">
                    <p className="cv-strong">
                      {job.title} {job.company && <span className="cv-muted">· {job.company}</span>}
                    </p>
                    {job.period && <p className="cv-muted cv-nowrap">{job.period}</p>}
                  </div>
                  {job.bullets?.length > 0 && (
                    <ul className="cv-list">
                      {job.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h3 className="cv-h">Educación</h3>
            <div className="cv-stack-sm">
              {data.education.map((ed, i) => (
                <div key={i} className="cv-row">
                  <p className="cv-strong">
                    {ed.title} {ed.school && <span className="cv-muted">· {ed.school}</span>}
                  </p>
                  {ed.year && <p className="cv-muted cv-nowrap">{ed.year}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h3 className="cv-h">Habilidades</h3>
            <ul className="cv-skills">
              {data.skills.map((s, i) => (
                <li key={i} className={highlighted.has(s.toLowerCase()) ? 'is-new' : ''}>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
