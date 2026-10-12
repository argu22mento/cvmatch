/** Control segmentado al estilo iOS. */
export default function Segmented({ label, options, value, onChange, className = '' }) {
  return (
    <div role="tablist" aria-label={label} className={`flex rounded-full bg-gray-200/70 p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 h-9 rounded-full px-3 text-[14px] font-semibold tracking-tight transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 active:text-gray-900'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {opt.label}
              {opt.dot && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-label="actualizado" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
