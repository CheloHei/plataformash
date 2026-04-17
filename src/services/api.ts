import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores';
import { ApiError } from '@/types/api';
import { RefreshTokenResponse } from '@/types/auth';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor - Añade el token a cada request
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Maneja errores y refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Si el error es 401 y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Si es el endpoint de login, dejar que el error llegue al catch del formulario
            if (originalRequest.url?.includes('/users/login')) {
                const apiError: ApiError = {
                    message: 'Usuario o contraseña incorrectos',
                    status: 401,
                };
                return Promise.reject(apiError);
            }

            if (isRefreshing) {
                // Si ya se está refrescando el token, añade a la cola
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Intenta refrescar el token
                const response = await axios.post<RefreshTokenResponse>(
                    `${API_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { token: newToken } = response.data;

                // Actualiza el token en el store
                useAuthStore.getState().setToken(newToken);

                // Procesa la cola de requests fallidos
                processQueue(null, newToken);

                // Reintenta el request original
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, cierra sesión
                processQueue(refreshError as AxiosError, null);
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Manejo de errores personalizados
        const apiError: ApiError = {
            message: error.response?.data?.message || 'Ha ocurrido un error',
            errors: error.response?.data?.errors,
            status: error.response?.status,
        };

        return Promise.reject(apiError);
    }
);

export default apiClient;
