import { useEffect, useRef, useState, type ReactNode } from 'react';

interface MenuItem {
  label: ReactNode;
  onClick: () => void;
  /** Show a small badge next to the label. */
  badge?: number;
  title?: string;
}

interface Props {
  label: ReactNode;
  items: MenuItem[];
  /** Optional title attribute on the trigger. */
  title?: string;
}

/**
 * A simple HUD dropdown menu. Click the label to open; click outside to close.
 * Used to group related top-bar buttons into a single trigger.
 */
export function HudMenu({ label, items, title }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="hud-menu-trigger"
        onClick={() => setOpen((o) => !o)}
        title={title}
        style={{
          background: open ? 'var(--tkm-bg-raised)' : 'transparent',
          color: 'var(--tkm-text-h2)',
          border: `1px solid ${open ? 'var(--tkm-text-h2)' : 'var(--tkm-border)'}`,
          padding: '0.35rem 0.7rem',
          fontFamily: 'var(--tkm-font-body)',
          fontSize: '0.82rem',
          cursor: 'pointer',
          letterSpacing: '0.1rem',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {label} <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: 180,
            background: 'var(--tkm-bg-modal)',
            border: '1px solid var(--tkm-text-h2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 100,
            animation: 'tkmFadeIn 0.12s ease-out',
          }}
        >
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => {
                it.onClick();
                setOpen(false);
              }}
              title={it.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                background: 'transparent',
                color: 'var(--tkm-text-body)',
                border: 'none',
                borderBottom: i < items.length - 1 ? '1px solid var(--tkm-border-soft)' : 'none',
                padding: '0.45rem 0.75rem',
                fontFamily: 'var(--tkm-font-body)',
                fontSize: '0.82rem',
                textAlign: 'left',
                cursor: 'pointer',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--tkm-bg-raised)';
                (e.currentTarget as HTMLElement).style.color = 'var(--tkm-text-h1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--tkm-text-body)';
              }}
            >
              <span>{it.label}</span>
              {it.badge !== undefined && it.badge > 0 && (
                <span
                  style={{
                    background: 'var(--tkm-danger)',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '0 0.4rem',
                    borderRadius: 8,
                    fontFamily: 'var(--tkm-font-mono)',
                  }}
                >
                  {it.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
