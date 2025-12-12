import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { Lock, User, Shield, ShieldAlert } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

const Login = () => {
    const [email, setEmail] = useState('employee@example.com');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    const handleQuickLogin = (roleEmail: string) => {
        setEmail(roleEmail);
        setPassword('');
        // Quick login users don't have passwords in mock DB
        dispatch(login({ email: roleEmail }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <GlassCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="p-2">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">L&D Portal</h1>
                        <p className="text-slate-500 dark:text-slate-400">Sign in to access your learning dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 dark:text-white"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 dark:text-white"
                                    placeholder="••••••••"
                                // Password optional for demo quick logins, but technically required for real users
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>

                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
                        <p className="text-xs text-center text-slate-500 mb-4">Quick Login (Demo)</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => handleQuickLogin('employee@example.com')}
                                className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-1 group-hover:scale-110 transition-transform">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">Employee</span>
                            </button>

                            <button
                                onClick={() => handleQuickLogin('admin@example.com')}
                                className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-1 group-hover:scale-110 transition-transform">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">Admin</span>
                            </button>

                            <button
                                onClick={() => handleQuickLogin('super@example.com')}
                                className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full mb-1 group-hover:scale-110 transition-transform">
                                    <ShieldAlert className="w-4 h-4" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">Super</span>
                            </button>

                            <button
                                onClick={() => handleQuickLogin('manager@example.com')}
                                className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-1 group-hover:scale-110 transition-transform">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">Manager</span>
                            </button>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
