import type {AuthResponse, LoginCredentials, RegisterCredentials, User} from "~~/types/auth";

export const authService = {

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const config = useRuntimeConfig();
        return await $fetch<AuthResponse>(`${config.public.apiBase}/api/v1/auth/login`, {
            method: 'POST',
            body: credentials
        });
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const config = useRuntimeConfig();

        return await $fetch<AuthResponse>(`${config.public.apiBase}/api/v1/auth/register`, {
            method: 'POST',
            body: credentials
        });
    },

    async fetchUser(accessToken: string): Promise<User> {
        const config = useRuntimeConfig();

        return await $fetch<User>(`${config.public.apiBase}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    },

    async refreshToken(oldRefreshToken: string): Promise<AuthResponse> {
        const config = useRuntimeConfig();

        return await $fetch<AuthResponse>(`${config.public.apiBase}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${oldRefreshToken}`
            }
        });
    }
};


export const getGoogleAuthUrl = () => {
    const config = useRuntimeConfig();
    return `${config.public.apiBase}/api/v1/oauth2/authorize/google`;
};