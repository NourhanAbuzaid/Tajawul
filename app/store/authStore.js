import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  roles:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("roles") || "[]")
      : [],

  setAuth: (accessToken, refreshToken, roles) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("roles", JSON.stringify(roles));
    set({ accessToken, refreshToken, roles });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },

  setRoles: (roles) => {
    localStorage.setItem("roles", JSON.stringify(roles));
    set({ roles });
  },

  addRole: (role) => {
    set((state) => {
      const updatedRoles = [...new Set([...state.roles, role])];
      localStorage.setItem("roles", JSON.stringify(updatedRoles));
      return { roles: updatedRoles };
    });
  },

  removeRole: (role) => {
    set((state) => {
      const updatedRoles = state.roles.filter((r) => r !== role);
      localStorage.setItem("roles", JSON.stringify(updatedRoles));
      return { roles: updatedRoles };
    });
  },

  hasRole: (role) => {
    return useAuthStore.getState().roles.includes(role);
  },

  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roles");
    set({ accessToken: null, refreshToken: null, roles: [] });
  },
}));

export default useAuthStore;
