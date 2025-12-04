
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar_url?: string;
        role: 'TRANSLATOR' | 'READER';
    };
}

export interface LoginCredentials {
    email?: string;
    password?: string;
    googleToken?: string; // Used for Google Auth flow
}

// Mocking the Backend Logic for now
export const authService = {

    // 1. Email/Password Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // In real app: return await $fetch('/api/auth/login', { method: 'POST', body: credentials })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email === 'test@demo.com' && credentials.password === 'password') {
                    resolve({
                        token: 'mock-jwt-token-xyz-123',
                        user: {
                            id: 'u1',
                            email: credentials.email,
                            name: 'Olmos Davronov',
                            avatar_url: '/avatar_male_default.png',
                            role: 'TRANSLATOR'
                        }
                    });
                } else {
                    reject({ message: 'Invalid email or password' });
                }
            }, 1000);
        });
    },

    // 2. Google Login (Backend exchange)
    // Usually, Frontend sends Google ID Token -> Backend verifies -> Backend returns App JWT
    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        // In real app: return await $fetch('/api/auth/google', { method: 'POST', body: { token: idToken } })

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    token: 'mock-google-jwt-token-789',
                    user: {
                        id: 'u2',
                        email: 'google-user@gmail.com',
                        name: 'Google User',
                        avatar_url: 'https://via.placeholder.com/150',
                        role: 'TRANSLATOR'
                    }
                });
            }, 1000);
        });
    }
};