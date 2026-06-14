import { useEffect, type CSSProperties, type ReactNode } from 'react';
import styles from './Modal.module.css';

export interface ModalProps {
  onClose: () => void;
  /** Header title (jin-gold). Omit (along with icon) and pass hideClose for a chromeless shell. */
  title?: ReactNode;
  /** Leading glyph before the title. */
  icon?: ReactNode;
  /** Muted count/subtitle riding after the title, e.g. "(3)" or "春季預算". */
  badge?: ReactNode;
  /** Extra controls in the header, left of the close button. */
  headerRight?: ReactNode;
  /** Frame width. Default 'min(560px, 100%)'. */
  width?: string;
  /** Frame max height. Default '86vh'. */
  maxHeight?: string;
  /** Stacking order of the backdrop. Default 900. */
  zIndex?: number;
  /** Padding of the frame interior. Default '1rem 1.2rem'. */
  padding?: string;
  /** Hide the × close button (rare — confirm dialogs that own their buttons). */
  hideClose?: boolean;
  /** Whether clicking the backdrop closes. Default true. */
  closeOnBackdrop?: boolean;
  /** Whether Esc closes. Default true. */
  closeOnEsc?: boolean;
  /** Extra class on the frame (for texture/seal opt-ins). */
  className?: string;
  frameStyle?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * The shared modal shell. Renders the canonical ink-panel frame, a dimmed
 * backdrop, a header row (icon · title · badge … headerRight × close), and the
 * body. Open motion (fade + rise) lives in the CSS module, so every dialog that
 * adopts this gains the same entrance for free. Esc and backdrop-click close by
 * default; opt out per-modal when a flow must be dismissed deliberately.
 */
export function Modal({
  onClose,
  title,
  icon,
  badge,
  headerRight,
  width = 'min(560px, 100%)',
  maxHeight = '86vh',
  zIndex = 900,
  padding = '1rem 1.2rem',
  hideClose = false,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
  frameStyle,
  ariaLabel,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, closeOnEsc]);

  const hasHeader = title != null || icon != null || headerRight != null || !hideClose;

  return (
    <div
      className={styles.backdrop}
      style={{ zIndex }}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        className={className ? `${styles.frame} ${className}` : styles.frame}
        style={{ width, maxHeight, padding, ...frameStyle }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.title}>
              {icon != null && <span className={styles.icon}>{icon}</span>}
              {title}
              {badge != null && <span className={styles.badge}>{badge}</span>}
            </div>
            {(headerRight != null || !hideClose) && (
              <div className={styles.headerRight}>
                {headerRight}
                {!hideClose && (
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
