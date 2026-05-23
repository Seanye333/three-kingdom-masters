import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import styles from './SaveSlotsModal.module.css';

interface Props {
  onClose: () => void;
  /** Mode: from title screen (load-only) vs in-game (save + load). */
  mode: 'save' | 'load';
}

export function SaveSlotsModal({ onClose, mode }: Props) {
  const saveSlot = useGameStore((s) => s.saveSlot);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const deleteSlotAction = useGameStore((s) => s.deleteSlot);
  const listSlotsFn = useGameStore((s) => s.listSlots);

  const [newLabel, setNewLabel] = useState('');
  const [refresh, setRefresh] = useState(0);
  const slots = listSlotsFn();

  const doSave = () => {
    const id = `slot-${Date.now()}`;
    saveSlot(id, newLabel.trim() || `Save ${new Date().toLocaleString()}`);
    setNewLabel('');
    setRefresh((n) => n + 1);
  };

  const doLoad = (id: string) => {
    const ok = loadSlot(id);
    if (ok) onClose();
    else alert('Failed to load save.');
  };

  const doDelete = (id: string) => {
    if (!confirm('Delete this save permanently?')) return;
    deleteSlotAction(id);
    setRefresh((n) => n + 1);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>
              {mode === 'save' ? '保存' : '読込'}
            </div>
            <div className={styles.titleEn}>
              {mode === 'save' ? 'Save Game' : 'Load Game'}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </header>

        <div className={styles.body}>
          {mode === 'save' && (
            <div className={styles.newSlot}>
              <input
                className={styles.newSlotInput}
                placeholder="Save label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <button className={styles.actionBtn} onClick={doSave}>
                保存 Save
              </button>
            </div>
          )}

          {slots.length === 0 ? (
            <div className={styles.empty}>
              {mode === 'save' ? 'No saves yet. Save one above.' : 'No saved games.'}
              <div style={{ marginTop: 8, fontSize: 11 }}>refresh #{refresh}</div>
            </div>
          ) : (
            slots.map((s) => (
              <div key={s.id} className={styles.slotRow}>
                <div className={styles.slotInfo}>
                  <span className={styles.slotLabel}>{s.label}</span>
                  <span className={styles.slotMeta}>
                    {s.playerForceName} · {s.year} {s.season} · {new Date(s.savedAt).toLocaleString()}
                  </span>
                </div>
                <button className={styles.loadBtn} onClick={() => doLoad(s.id)}>
                  読込 Load
                </button>
                <button className={styles.delBtn} onClick={() => doDelete(s.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
