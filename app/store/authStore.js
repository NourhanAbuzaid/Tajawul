import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,

  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearTokens: () => set({ accessToken: null, refreshToken: null }),
}));

export default useAuthStore;
