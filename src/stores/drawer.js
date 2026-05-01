import { create } from "zustand";


export const useDrawerStore = create((set) => ({
  collapsed: false,
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  forceClose: () => set({ collapsed: true }),
}));