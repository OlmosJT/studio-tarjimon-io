import { authService, type LoginCredentials, type AuthResponse } from '~/services/authService';

export const useAuth = () => {
    // 1. State
    // useCookie ensures this persists across refreshes and is available server-side
    const token = useCookie<string | null>('auth_token', {
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // User state (doesn't strictly need to be a cookie, can be state)
    const user = useState<AuthResponse['user'] | null>('auth_user', () => null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 2. Actions

    // Helper to set state after successful login
    const handleAuthSuccess = (response: AuthResponse) => {
        token.value = response.token;
        user.value = response.user;
        error.value = null;
        // Redirect to dashboard
        navigateTo('/dashboard');
    };

    const login = async (creds: LoginCredentials) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await authService.login(creds);
            handleAuthSuccess(response);
        } catch (e: any) {
            error.value = e.message || 'Login failed';
        } finally {
            loading.value = false;
        }
    };

    // Google Login Logic
    // This function is called AFTER Google returns the ID Token to the frontend
    const loginWithGoogle = async (googleIdToken: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await authService.loginWithGoogle(googleIdToken);
            handleAuthSuccess(response);
        } catch (e: any) {
            error.value = 'Google sign-in failed';
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        navigateTo('/login');
    };

    return {
        token,
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: computed(() => !!token.value)
    };
};