import { create } from "zustand";
import type { AppStore } from "./types";

export const useAppStore = create<AppStore>()((set) => ({
    isLoading: false,

    setIsLoading: (val) => set({ isLoading: val })
}));
