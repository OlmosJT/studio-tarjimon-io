import { authService, getGoogleAuthUrl } from '~/services/authService';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '~~/types/auth';

export const useAuth = () => {
    // 1. State
    // We use distinct cookies for access and refresh tokens
    const accessToken = useCookie<string | null>('access_token', {
        maxAge: 60 * 15, // 15 minutes (matches backend)
        sameSite: 'lax'
    });

    const refreshToken = useCookie<string | null>('refresh_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days (matches backend)
        sameSite: 'lax'
    });

    // User state (shared across components via useState)
    const user = useState<User | null>('auth_user', () => null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 2. Internal Helpers
    const setSession = (response: AuthResponse) => {
        accessToken.value = response.access_token;
        refreshToken.value = response.refresh_token;
        user.value = response.user;
        error.value = null;
    };

    const clearSession = () => {
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
    };

    // 3. Actions

    // --- Standard Login ---
    const login = async (creds: LoginCredentials) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await authService.login(creds);
            setSession(response);
            navigateTo('/dashboard/projects');
        } catch (e: any) {
            error.value = 'Invalid email or password';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    // --- Registration ---
    const register = async (creds: RegisterCredentials) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await authService.register(creds);
            setSession(response);
            navigateTo('/dashboard');
        } catch (e: any) {
            error.value = 'Registration failed. Email might be in use.';
        } finally {
            loading.value = false;
        }
    };

    // --- Google Login (Redirect) ---
    // This triggers the browser to leave your app and go to backend -> Google
    const loginWithGoogle = () => {
        if (import.meta.client) {
            window.location.href = getGoogleAuthUrl();
        }
    };

    // --- Refresh Token Logic ---
    // Called automatically by interceptors or manually on 401
    const refreshUserToken = async () => {
        if (!refreshToken.value) return false;

        try {
            const response = await authService.refreshToken(refreshToken.value);
            setSession(response); // Updates both cookies
            return true;
        } catch (e) {
            // If refresh fails, the user must login again
            logout();
            return false;
        }
    };

    // --- Logout ---
    const logout = () => {
        clearSession();
        navigateTo('/login');
    };

    // --- Initialization (Load User on Page Refresh) ---
    // If we have an access token but no user state (e.g. F5 refresh), fetch the user
    const initUser = async () => {
        if (accessToken.value && !user.value) {
            loading.value = true;
            try {
                user.value = await authService.fetchUser(accessToken.value);
            } catch (e) {
                // If fetch fails (e.g. token expired), try to refresh
                await refreshUserToken();
            } finally {
                loading.value = false;
            }
        } else if (!accessToken.value && refreshToken.value) {
            // Access token gone, but refresh token exists? Try to refresh immediately
            await refreshUserToken();
        }
    };

    return {
        // State
        accessToken,
        user,
        loading,
        error,

        // Actions
        login,
        register,
        loginWithGoogle,
        logout,
        initUser,

        // Manual setter for OAuth Callback page
        setSession,

        // Getters
        isAuthenticated: computed(() => !!user.value)
    };
};