import { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

/** Tarjeta con área de texto que crece con el contenido. */
export default function InputCard({ id, icon: Icon, label, hint, value, onChange, placeholder, actions, banner, dropProps = {}, dragging }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    // En móvil no dejamos que el campo ocupe más de media pantalla
    const max = Math.min(520, Math.round(window.innerHeight * 0.5));
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
  }, [value]);

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <section
      {...dropProps}
      className={`relative rounded-3xl bg-white border shadow-sm transition-all focus-within:shadow-md ${
        dragging ? 'border-blue-500 ring-4 ring-blue-500/15' : 'border-gray-200 focus-within:border-gray-300'
      }`}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-3xl bg-white/85 backdrop-blur-sm">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-blue-600">
            <Upload size={18} aria-hidden="true" />
            Suelta el PDF para leerlo
          </p>
        </div>
      )}

      <header className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
        <label htmlFor={id} className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center h-8 w-8 shrink-0 rounded-xl bg-gray-100 text-gray-700">
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[16px] sm:text-[15px] font-semibold tracking-tight text-gray-900">{label}</span>
            <span className="block text-[13px] text-gray-500 truncate">{hint}</span>
          </span>
        </label>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="h-10 rounded-full px-3 text-[14px] sm:text-[13px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Borrar
            </button>
          )}
        </div>
      </header>

      {banner}

      {/* 16px como mínimo: así iOS no hace zoom al escribir */}
      <textarea
        id={id}
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        spellCheck={false}
        autoCapitalize="sentences"
        className="block w-full resize-none bg-transparent px-4 sm:px-6 pt-4 pb-2 text-[16px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      <footer className="px-4 sm:px-6 pb-4 text-[12px] text-gray-400 tabular-nums">
        {words} {words === 1 ? 'palabra' : 'palabras'}
      </footer>
    </section>
  );
}
