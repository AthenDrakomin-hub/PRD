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
      name: 'cyber-knowledge-base-storage',
    }
  )
);
