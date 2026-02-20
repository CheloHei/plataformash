import { AuthResponse } from '@/types/auth';
import { User } from '@/types/User';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
}

interface AuthActions {
    setAuth: (data: AuthResponse) => void;
    setToken: (token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setHydrated: (value: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,

            setAuth: (data: AuthResponse) =>
                set({
                    user: data.usuario,
                    token: data.token,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                }),

            setToken: (token: string) =>
                set({
                    token,
                }),

            logout: () => set(initialState),

            updateUser: (userData: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),

            setHydrated: (value: boolean) =>
                set({
                    isHydrated: value,
                }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHydrated(true);
                }
            },
        }
    )
);
