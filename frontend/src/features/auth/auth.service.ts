import { api } from "@/lib/apis";

export const authService = {
   async GoogleLogin() {
      window.location.href = `http://localhost:3000/auth/google`
   },
   getSession: async () => {
      const res = await api.get("/auth/session");
      return res.data;
   },
   logout: async () => {
      await api.post("/auth/logout");
   },
};