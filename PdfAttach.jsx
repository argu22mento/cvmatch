import { AlertCircle, Loader2, Paperclip, X } from 'lucide-react';

/** Botón «Adjuntar PDF» para la cabecera de la tarjeta del CV. */
export function PdfAttachButton({ pdf }) {
  return (
    <>
      <input
        id="cv-pdf"
        ref={pdf.inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={pdf.onInputChange}
      />
      <button
        type="button"
        onClick={pdf.openPicker}
        disabled={pdf.reading}
        aria-label="Adjuntar CV en PDF"
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-200 px-3.5 text-[14px] sm:text-[13px] font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {pdf.reading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Paperclip size={16} aria-hidden="true" />}
        <span>{pdf.reading ? 'Leyendo…' : 'PDF'}</span>
      </button>
    </>
  );
}

/** Ficha del PDF importado o aviso de error. */
export function PdfBanner({ pdf, onRemove }) {
  if (!pdf.info && !pdf.error) return null;

  return (
    <div className="px-4 sm:px-6 pt-4">
      {pdf.error ? (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 px-3.5 py-2.5 text-[14px] sm:text-[13px] leading-snug text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {pdf.error}
        </p>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 py-2 pl-3.5 pr-1.5">
          <span className="grid place-items-center h-8 w-8 shrink-0 rounded-lg bg-red-50 text-[10px] font-bold tracking-wide text-red-600">PDF</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] sm:text-[13px] font-medium text-gray-900">{pdf.info.name}</p>
            <p className="text-[12px] text-gray-500">
              {pdf.info.pages} {pdf.info.pages === 1 ? 'página' : 'páginas'} · texto importado, puedes editarlo
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar PDF adjunto"
            className="grid place-items-center h-10 w-10 shrink-0 rounded-full text-gray-500 hover:bg-gray-200 active:bg-gray-200 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
