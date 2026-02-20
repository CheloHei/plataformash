import { User } from "./User";


export interface LoginCredentials {
    user: string;
    passw: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface AuthResponse {
    usuario: User;
    token: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
}
