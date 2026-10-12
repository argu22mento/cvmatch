import { useRef, useState } from 'react';
import { Briefcase, Download, FileText, Loader2, PencilLine, RotateCcw, Sparkles, Wand2 } from 'lucide-react';

import { BASE_CV, OPTIMIZED_CV, SAMPLE_CV, SAMPLE_OFFER } from './cvData';
import { usePdfImport } from './usePdfImport';
import InputCard from './InputCard';
import { PdfAttachButton, PdfBanner } from './PdfAttach';
import CvSheet from './CvSheet';
import Segmented from './Segmented';
import Toast from './Toast';

const isSmallScreen = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;

/* Estilos de botón compartidos */
const btnPrimary =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gray-900 px-7 text-[16px] sm:text-[15px] font-semibold text-white shadow-xl shadow-gray-900/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40';
const btnSecondary =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[16px] sm:text-[15px] font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

export default function App() {
  const [cvText, setCvText] = useState(SAMPLE_CV);
  const [offerText, setOfferText] = useState(SAMPLE_OFFER);
  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [tab, setTab] = useState('data'); // solo afecta a móvil y tablet
  const [view, setView] = useState(isSmallScreen() ? 'reading' : 'a4');
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };

  const pdf = usePdfImport({
    onText: (text) => {
      setCvText(text);
      showToast('Texto del CV importado');
    },
  });

  const cv = optimized ? OPTIMIZED_CV : BASE_CV;
  const ready = cvText.trim() && offerText.trim();
  const canSubmit = ready && !loading;

  const goTo = (next) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulación de la llamada a la IA (2 s). Sustituir por la petición al backend.
  const handleOptimize = () => {
    if (!canSubmit) return;
    document.activeElement?.blur();
    setLoading(true);
    setTimeout(() => {
      setOptimized(true);
      setLoading(false);
      goTo('preview');
      showToast('CV adaptado a la oferta');
    }, 2000);
  };

  const handleReset = () => {
    setOptimized(false);
    showToast('Vista restaurada al CV original');
  };

  // Abre el diálogo del sistema: «Guardar como PDF» en ordenador, «Compartir › Guardar en Archivos» en el móvil.
  const handleDownload = () => window.print();

  const optimizeLabel = loading ? (
    <>
      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      Cargando…
    </>
  ) : (
    <>
      <Wand2 size={18} aria-hidden="true" />
      Optimizar CV con IA
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 antialiased">
      {/* Cabecera con efecto cristal */}
      <header
        className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/70 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center h-7 w-7 rounded-lg bg-gray-900 text-white">
              <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">CV Match</span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
              optimized ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${optimized ? 'bg-green-600' : 'bg-gray-400'}`} />
            {optimized ? 'Optimizado' : 'Borrador'}
          </span>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
          <Segmented
            label="Sección"
            value={tab}
            onChange={goTo}
            options={[
              { value: 'data', label: 'Datos' },
              { value: 'preview', label: 'Vista previa', dot: optimized && tab !== 'preview' },
            ]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-36 lg:py-12">
        <div className={`mb-6 lg:mb-10 max-w-2xl ${tab === 'data' ? '' : 'hidden'} lg:block`}>
          <h1 className="text-[28px] sm:text-[40px] font-semibold tracking-tight leading-[1.12] text-balance">
            Tu currículum, a medida de cada oferta.
          </h1>
          <p className="mt-2 sm:mt-3 text-[16px] sm:text-[17px] leading-relaxed text-gray-500">
            Pega o adjunta tu CV y la oferta. La IA ajusta el titular, el extracto y las habilidades a lo que pide la empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Columna izquierda: entrada */}
          <div
            className={`flex-col gap-4 sm:gap-5 min-w-0 ${tab === 'data' ? 'flex' : 'hidden'} lg:flex`}
            onFocusCapture={(e) => e.target.tagName === 'TEXTAREA' && setEditing(true)}
            onBlurCapture={(e) => e.target.tagName === 'TEXTAREA' && setEditing(false)}
          >
            <InputCard
              id="cv-actual"
              icon={FileText}
              label="CV actual"
              hint="Pega el texto o adjunta tu PDF"
              value={cvText}
              onChange={(v) => {
                setCvText(v);
                if (!v) pdf.reset();
              }}
              placeholder="Pega aquí el texto de tu CV o adjunta el PDF…"
              actions={<PdfAttachButton pdf={pdf} />}
              banner={
                <PdfBanner
                  pdf={pdf}
                  onRemove={() => {
                    pdf.reset();
                    setCvText('');
                  }}
                />
              }
              dropProps={pdf.dropProps}
              dragging={pdf.dragging}
            />
            <InputCard
              id="oferta"
              icon={Briefcase}
              label="Oferta de empleo"
              hint="Descripción del puesto y requisitos"
              value={offerText}
              onChange={setOfferText}
              placeholder="Pega aquí la oferta de empleo…"
            />

            {/* Acciones en escritorio */}
            <div className="hidden lg:flex items-center gap-3 pt-1">
              <button type="button" onClick={handleOptimize} disabled={!canSubmit} aria-busy={loading} className={btnPrimary}>
                {optimizeLabel}
              </button>
              {optimized && !loading && (
                <button type="button" onClick={handleReset} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-medium text-gray-600 hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <RotateCcw size={16} aria-hidden="true" />
                  Ver original
                </button>
              )}
            </div>
            {!ready && <p className="text-[14px] sm:text-[13px] text-gray-500">Rellena los dos campos para poder optimizar.</p>}
          </div>

          {/* Columna derecha: previsualización */}
          <div className={`min-w-0 lg:sticky lg:top-24 ${tab === 'preview' ? 'block' : 'hidden'} lg:block`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[17px] sm:text-[15px] font-semibold tracking-tight">Previsualización</h2>
                <p className="text-[13px] text-gray-500">
                  {optimized ? 'Las habilidades nuevas aparecen en azul' : 'A4 · 210 × 297 mm'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Segmented
                  label="Modo de vista"
                  value={view}
                  onChange={setView}
                  className="w-44"
                  options={[
                    { value: 'a4', label: 'Folio' },
                    { value: 'reading', label: 'Lectura' },
                  ]}
                />
                <button
                  type="button"
                  onClick={handleDownload}
                  className="hidden lg:inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur-md px-4 text-[14px] font-medium text-gray-900 shadow-sm hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Download size={16} aria-hidden="true" />
                  Descargar PDF
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-100/60 p-3 sm:p-8">
              <div className="paper-shadow mx-auto w-full max-w-[560px]">
                <CvSheet data={cv} optimized={optimized} refreshing={loading} reading={view === 'reading'} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Barra de acciones inferior en móvil y tablet */}
      <div
        className={`bottom-bar lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/70 bg-white/75 backdrop-blur-md px-4 pt-3 transition-transform duration-200 ${
          editing ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="mx-auto flex max-w-xl gap-3">
          {tab === 'data' ? (
            <button type="button" onClick={handleOptimize} disabled={!canSubmit} aria-busy={loading} className={`${btnPrimary} w-full`}>
              {optimizeLabel}
            </button>
          ) : (
            <>
              {optimized ? (
                <button type="button" onClick={handleReset} className={`${btnSecondary} flex-1`}>
                  <RotateCcw size={18} aria-hidden="true" />
                  Original
                </button>
              ) : (
                <button type="button" onClick={() => goTo('data')} className={`${btnSecondary} flex-1`}>
                  <PencilLine size={18} aria-hidden="true" />
                  Editar
                </button>
              )}
              <button type="button" onClick={handleDownload} className={`${btnPrimary} flex-[1.4] px-5`}>
                <Download size={18} aria-hidden="true" />
                Descargar PDF
              </button>
            </>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
