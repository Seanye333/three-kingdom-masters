import { Seal } from './Seal';
import styles from './LoadingSplash.module.css';

/**
 * 品牌加載頁 — the splash behind the Suspense boundary while the realm's 3D
 * chunks stream in. A breathing 鼎 seal over the wordmark and an indeterminate
 * ink sweep, in place of the old bare "展開輿圖…" line.
 */
export function LoadingSplash({ label = '展開輿圖…' }: { label?: string }) {
  return (
    <div className={styles.root} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.inner}>
        <Seal chars="鼎" size={76} rotate={-6} className={styles.seal} />
        <div className={styles.wordmark}>三國志</div>
        <div className={styles.bar} />
        <div className={styles.caption}>{label}</div>
      </div>
    </div>
  );
}
