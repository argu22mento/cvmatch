import { useRef, useState } from 'react';
import { extractPdfText, MAX_PDF_MB } from './extractPdfText';

/**
 * Gestiona la importación del CV en PDF: selector de archivo, arrastrar y soltar,
 * estado de lectura y mensajes de error.
 */
export function usePdfImport({ onText }) {
  const [info, setInfo] = useState(null); // { name, pages }
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef(null);

  const importFile = async (file) => {
    if (!file) return;
    setError('');
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      setError('Ese archivo no es un PDF. Adjunta tu CV en formato .pdf.');
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setError(`El PDF pesa más de ${MAX_PDF_MB} MB. Prueba con una versión más ligera.`);
      return;
    }
    setReading(true);
    try {
      const { text, numPages } = await extractPdfText(file);
      if (!text) {
        setError('No se ha encontrado texto en el PDF. Si es un documento escaneado, pega el texto a mano.');
        return;
      }
      onText(text);
      setInfo({ name: file.name, pages: numPages });
    } catch {
      setError('No se ha podido leer el PDF. Comprueba que no esté protegido con contraseña.');
    } finally {
      setReading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const hasFiles = (e) => Array.from(e.dataTransfer?.types || []).includes('Files');

  const dropProps = {
    onDragEnter: (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    },
    onDragOver: (e) => {
      if (hasFiles(e)) e.preventDefault();
    },
    onDragLeave: () => {
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    },
    onDrop: (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      importFile(e.dataTransfer.files[0]);
    },
  };

  return {
    info,
    reading,
    error,
    dragging,
    dropProps,
    inputRef,
    openPicker: () => inputRef.current && inputRef.current.click(),
    onInputChange: (e) => importFile(e.target.files[0]),
    reset: () => {
      setInfo(null);
      setError('');
    },
  };
}
