// Función de Vercel: recibe el CV y la oferta, y devuelve el CV de la persona adaptado a la oferta.
// Usa la API de Gemini (Google AI Studio), que tiene nivel gratuito.
// Necesita la variable de entorno GEMINI_API_KEY (Vercel › Settings › Environment Variables).

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_CHARS = 20000;

const SYSTEM = `Eres un experto en selección de personal y redacción de currículums en español.
Tu trabajo es ADAPTAR el currículum real de una persona a una oferta de empleo concreta.

Reglas obligatorias:
1. Usa SOLO información que aparezca en el CV original: nombre, contacto, empresas, puestos, fechas, estudios y logros son los de la persona. Nunca inventes empresas, cargos, fechas, titulaciones, cifras ni herramientas.
2. Puedes reescribir, reordenar y priorizar: pon delante lo que más encaja con la oferta, usa el vocabulario de la oferta cuando describa algo que la persona realmente ha hecho y resume lo que no aporta.
3. El titular (role) debe acercarse al puesto de la oferta sin atribuir un cargo que la persona no haya tenido; por ejemplo, combina su perfil real con el área de la oferta.
4. Habilidades: solo las que estén en el CV o se deduzcan claramente de su experiencia. Ordénalas de más a menos relevantes para la oferta.
5. Si la oferta pide algo que no aparece en el CV, NO lo añadas al currículum: anótalo en "gaps".
6. Si un dato no aparece (por ejemplo, el año de un estudio), deja el campo vacío.
7. Escribe en el idioma del CV original, con frases concretas y verbos de acción. Entre 2 y 5 viñetas por puesto.`;

const S = { type: 'STRING' };
const LIST = { type: 'ARRAY', items: S };

// Esquema de la respuesta (formato de Gemini)
const CV_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: S,
    role: S,
    contact: LIST,
    summary: S,
    experience: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { company: S, title: S, period: S, bullets: LIST },
        required: ['company', 'title', 'period', 'bullets'],
      },
    },
    education: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { title: S, school: S, year: S },
        required: ['title', 'school', 'year'],
      },
    },
    skills: LIST,
    highlightedSkills: LIST,
    gaps: LIST,
  },
  required: ['name', 'role', 'contact', 'summary', 'experience', 'education', 'skills', 'highlightedSkills', 'gaps'],
};

const FORMAT = `Responde SOLO con un objeto JSON con estos campos:
name (nombre completo tal como aparece en el CV), role (titular adaptado), contact (lista: email, teléfono, ciudad, LinkedIn… solo los que aparezcan),
summary (extracto de 2 a 4 frases orientado a la oferta), experience (lista de {company, title, period, bullets}),
education (lista de {title, school, year}), skills (habilidades reales, de más a menos relevantes),
highlightedSkills (las de "skills" que coinciden con la oferta), gaps (requisitos de la oferta que no aparecen en el CV).`;

async function callGemini({ apiKey, cv, offer, useSchema }) {
  const generationConfig = { responseMimeType: 'application/json', temperature: 0.4 };
  if (useSchema) generationConfig.responseSchema = CV_SCHEMA;

  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `${SYSTEM}\n\n${FORMAT}` }] },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `<cv_original>\n${cv}\n</cv_original>\n\n<oferta_de_empleo>\n${offer}\n</oferta_de_empleo>\n\nAdapta el CV original a esta oferta siguiendo las reglas.`,
            },
          ],
        },
      ],
      generationConfig,
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en Vercel.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const cv = String(body.cv || '').trim();
  const offer = String(body.offer || '').trim();

  if (!cv || !offer) {
    return res.status(400).json({ error: 'Faltan el CV o la oferta.' });
  }
  if (cv.length > MAX_CHARS || offer.length > MAX_CHARS) {
    return res.status(400).json({ error: 'El CV o la oferta son demasiado largos. Recórtalos a unas 3.000 palabras.' });
  }

  try {
    let response = await callGemini({ apiKey, cv, offer, useSchema: true });
    // Si el modelo no acepta el esquema, se repite la petición pidiendo el JSON solo con instrucciones.
    if (response.status === 400) {
      const peek = await response.clone().json().catch(() => ({}));
      const msg = JSON.stringify(peek);
      if (!/API_KEY|api key/i.test(msg)) response = await callGemini({ apiKey, cv, offer, useSchema: false });
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Gemini API', response.status, JSON.stringify(data));
      const raw = JSON.stringify(data);
      const msg = /API_KEY_INVALID|API key not valid/i.test(raw) || response.status === 403
        ? 'La clave de Gemini no es válida. Revísala en Vercel.'
        : response.status === 429
        ? 'Se ha alcanzado el límite gratuito de Gemini. Espera un minuto y vuelve a intentarlo.'
        : response.status === 404
        ? 'El modelo de Gemini configurado no existe. Revisa GEMINI_MODEL en Vercel.'
        : 'El servicio de IA no ha respondido. Inténtalo de nuevo en unos segundos.';
      return res.status(502).json({ error: msg });
    }

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || '')
      .join('')
      .trim();
    const result = parseJson(text);
    if (!result || !result.name) {
      console.error('Respuesta no válida', data.candidates?.[0]?.finishReason, text.slice(0, 500));
      return res.status(502).json({ error: 'La IA no ha devuelto un CV válido. Inténtalo de nuevo.' });
    }

    return res.status(200).json(normalize(result));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'No se ha podido adaptar el CV. Inténtalo de nuevo.' });
  }
}

// Extrae el objeto JSON aunque venga envuelto en ```json … ```
function parseJson(text) {
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  return safeParse(clean.slice(start, end + 1));
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// Asegura que todos los campos existen y tienen el tipo esperado por la interfaz.
function normalize(r) {
  const arr = (v) => (Array.isArray(v) ? v.filter(Boolean).map(String) : []);
  return {
    name: String(r.name || ''),
    role: String(r.role || ''),
    contact: arr(r.contact),
    summary: String(r.summary || ''),
    experience: (Array.isArray(r.experience) ? r.experience : []).map((e) => ({
      company: String(e.company || ''),
      title: String(e.title || ''),
      period: String(e.period || ''),
      bullets: arr(e.bullets),
    })),
    education: (Array.isArray(r.education) ? r.education : []).map((e) => ({
      title: String(e.title || ''),
      school: String(e.school || ''),
      year: String(e.year || ''),
    })),
    skills: arr(r.skills),
    highlightedSkills: arr(r.highlightedSkills),
    gaps: arr(r.gaps),
  };
}
