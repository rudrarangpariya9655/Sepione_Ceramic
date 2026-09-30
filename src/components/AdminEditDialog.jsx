"use client";

import { useEffect, useRef } from 'react';

export default function AdminEditDialog({ children, onClose, returnFocusRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const returnFocus = returnFocusRef.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector('input')?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const fields = [...ref.current.querySelectorAll('input:not(:disabled), button:not(:disabled), [tabindex="0"]')];
    const first = fields[0];
    const last = fields.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  return <dialog ref={ref} role="dialog" aria-modal="true" aria-labelledby="admin-edit-title"
    className="m-auto max-h-[90dvh] overflow-y-auto bg-transparent p-0 backdrop:bg-black/80"
    style={{ width: 'min(28rem, calc(100% - 2rem))' }}
    onKeyDown={trapFocus} onCancel={event => { event.preventDefault(); onClose(); }}>
    {children}
  </dialog>;
}
