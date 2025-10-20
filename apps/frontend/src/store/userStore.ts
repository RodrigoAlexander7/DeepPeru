import { create } from 'zustand';
import { authService } from '@/features/auth/auth.service';

type User = { id: string; name: string; email: string; image?: string };

type UserState = {
  user: User | null;
  isLoading: boolean; //
  fetchUser: () => Promise<void>; // async function to fetch user session
  logout: () => Promise<void>; // async function to log out user
};

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    try {
      const data = await authService.getSession();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
