/** Aviso breve; en móvil queda por encima de la barra de acciones. */
export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast fixed left-1/2 z-50 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full bg-gray-900/90 backdrop-blur-md px-5 py-2.5 text-center text-[14px] font-medium text-white shadow-xl transition-all duration-300 ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}
