import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores';
import { ApiError } from '@/types/api';
import { authService } from '@/services/authService';
import shellLogo from '@/assets/images/logo-shell.png';

const loginSchema = z.object({
    user: z.string().min(3, 'Usuario inválido'),
    passw: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setHydrated = useAuthStore((state) => state.setHydrated);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.login(data);
            setAuth(response);
            setHydrated(true);
            navigate('/');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background">
            {/* Mobile-First Container */}
            <div className="flex min-h-screen flex-col lg:flex-row">

                {/* Left Panel - Branding (Hidden on mobile, visible on lg+) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 shell-gradient" />

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-shell-red/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-shell-yellow/30 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-shell-dark">
                        <div className="max-w-md space-y-8 text-center">
                            {/* Logo Container - Aquí colocarás tu logo de Shell */}
                            <div className="flex justify-center mb-8 animate-fade-in">
                                <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4">
                                    {/* Placeholder - Reemplaza con tu logo */}
                                    {/* <div className="text-6xl font-bold text-shell-red">S</div> */}
                                    {/* Cuando tengas el logo, usa: */}
                                    <img src={shellLogo} alt="Plataforma de Entrenamiento Shell" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <h1 className="text-4xl font-bold tracking-tight">
                                    Plataforma de Entrenamiento Shell
                                </h1>
                                <p className="text-lg text-shell-dark/80 font-medium">
                                    Plataforma de entrenamiento virtual
                                </p>
                            </div>

                            <div className="pt-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 text-shell-dark/70">
                                    <div className="w-12 h-12 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span className="text-left">Gestión de cursos</span>
                                </div>
                                <div className="flex items-center gap-3 text-shell-dark/70">
                                    <div className="w-12 h-12 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <span className="text-left">Seguimiento de logros y progreso</span>
                                </div>
                                <div className="flex items-center gap-3 text-shell-dark/70">
                                    <div className="w-12 h-12 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-left">Obtención de recompensas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background">
                    <div className="w-full max-w-md">

                        {/* Mobile Logo (visible only on mobile) */}
                        <div className="flex justify-center mb-8 lg:hidden">
                            <div className="w-20 h-20 bg-gradient-to-br from-shell-yellow to-shell-red rounded-xl shadow-lg flex items-center justify-center">
                                <div className="text-3xl font-bold text-white">SH</div>
                                {/* Cuando tengas el logo: */}
                                {/* <img src={shellLogo} alt="Shell Academy" className="w-16 h-16 object-contain" /> */}
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8 space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                Bienvenido
                            </h2>
                            <p className="text-muted-foreground">
                                Ingresa tus credenciales para continuar
                            </p>
                        </div>

                        {/* Login Form */}
                        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8 space-y-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                {/* Error Message */}
                                {error && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 animate-fade-in">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-destructive flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-destructive font-medium">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* User Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="user"
                                        className="block text-sm font-semibold text-foreground"
                                    >
                                        Usuario
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className={`w-5 h-5 transition-colors ${errors.user ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-shell-yellow'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="user"
                                            type="text"
                                            placeholder="tu@email.com"
                                            className={`w-full pl-12 pr-4 py-3.5 rounded-lg border-2 bg-background text-foreground placeholder:text-muted-foreground
                                                transition-all duration-200 outline-none
                                                ${errors.user
                                                    ? 'border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/10'
                                                    : 'border-input focus:border-shell-yellow focus:ring-4 focus:ring-shell-yellow/10'
                                                }`}
                                            {...register('user')}
                                        />
                                    </div>
                                    {errors.user && (
                                        <p className="text-sm text-destructive font-medium flex items-center gap-1 mt-1.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.user.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="passw"
                                        className="block text-sm font-semibold text-foreground"
                                    >
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className={`w-5 h-5 transition-colors ${errors.passw ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-shell-yellow'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="passw"
                                            type="password"
                                            placeholder="••••••••"
                                            className={`w-full pl-12 pr-4 py-3.5 rounded-lg border-2 bg-background text-foreground placeholder:text-muted-foreground
                                                transition-all duration-200 outline-none
                                                ${errors.passw
                                                    ? 'border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/10'
                                                    : 'border-input focus:border-shell-yellow focus:ring-4 focus:ring-shell-yellow/10'
                                                }`}
                                            {...register('passw')}
                                        />
                                    </div>
                                    {errors.passw && (
                                        <p className="text-sm text-destructive font-medium flex items-center gap-1 mt-1.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.passw.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-6 py-3.5 px-4 rounded-lg font-semibold text-shell-dark
                                        shell-gradient shadow-lg shadow-shell-yellow/25
                                        hover:shadow-xl hover:shadow-shell-yellow/40 hover:scale-[1.02]
                                        active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                        transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Cargando...
                                        </span>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </button>
                            </form>

                            {/* Footer Links */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-center text-sm text-muted-foreground">
                                    ¿No tienes una cuenta?{' '}
                                    <Link
                                        to="/auth/signup"
                                        className="font-semibold text-shell-red hover:text-shell-red/80 transition-colors"
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <p className="text-center text-xs text-muted-foreground mt-8">
                            © 2026 Plataforma Shell. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
