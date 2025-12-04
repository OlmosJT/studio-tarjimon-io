export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar_url?: string;
    role: 'TRANSLATOR' | 'READER' | 'ADMIN';
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface LoginCredentials {
    email?: string;
    password?: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}