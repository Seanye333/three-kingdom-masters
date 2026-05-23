import { useState, type ReactNode } from 'react';

interface Props {
  /** Tooltip body — typically the English explanation. */
  text: string;
  /** Optional secondary line. */
  hint?: string;
  children: ReactNode;
}

/**
 * Lightweight inline tooltip: wrap any zh term to show an en explanation
 * on hover/focus. Uses absolute positioning relative to a span wrapper.
 */
export function Tooltip({ text, hint, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', cursor: 'help', borderBottom: '1px dotted #8a7050' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      {open && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1410',
            border: '1px solid #d4a84a',
            color: '#d4a84a',
            padding: '0.35rem 0.65rem',
            fontSize: '0.78rem',
            fontFamily: 'ui-monospace, monospace',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 999,
            boxShadow: '0 0 8px rgba(212, 168, 74, 0.4)',
          }}
        >
          {text}
          {hint && (
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#8a7050', fontStyle: 'italic' }}>
              {hint}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
