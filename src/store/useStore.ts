import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TechStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProgressState {
  status: TechStatus;
  note: string;
}

interface AppState {
  userProgress: Record<string, ProgressState>;
  updateStatus: (techId: string, status: TechStatus) => void;
  updateNote: (techId: string, note: string) => void;
  resetProgress: () => void;
}

const legacyStorageKey = ['cyber', 'knowledge', 'base', 'storage'].join('-');
const storageKey = 'kforge-storage';

try {
  const hasNew = typeof localStorage !== 'undefined' && localStorage.getItem(storageKey);
  const hasOld = typeof localStorage !== 'undefined' && localStorage.getItem(legacyStorageKey);
  if (!hasNew && hasOld) {
    localStorage.setItem(storageKey, hasOld);
  }
} catch {}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userProgress: {},
      updateStatus: (techId, status) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [techId]: {
              ...state.userProgress[techId],
              status,
              note: state.userProgress[techId]?.note || '',
            },
          },
        })),
      updateNote: (techId, note) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [techId]: {
              ...state.userProgress[techId],
              status: state.userProgress[techId]?.status || 'not_started',
              note,
            },
          },
        })),
      resetProgress: () => set({ userProgress: {} }),
    }),
    {
      name: storageKey,
    }
  )
);
