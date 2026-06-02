import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | '';
  onClear: () => void;
}

export default function Toast({ message, type, onClear }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClear, 350);
    }, 3000);
    return () => clearTimeout(t);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div id="toast" className={`${visible ? 'show' : ''} ${type ?? ''}`}>
      {message}
    </div>
  );
}
