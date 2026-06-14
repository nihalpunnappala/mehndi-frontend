import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [isLogin, setIsLogin]   = useState(true);
    const [name, setName]         = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const { login }   = useContext(AuthContext);
    const navigate    = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { data } = await api.post('/auth/login', { email, password });
                login(data, data.token);
                toast.success('Welcome back! Logged in successfully.');
                navigate('/');
            } else {
                await api.post('/auth/register', { name, email, password });
                toast.success('Account created! Please sign in.');
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-wide">Login</h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-8">
                        <h2 className="text-xl font-bold text-black mb-1">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {isLogin ? 'Sign in to your account' : 'Fill in the details to get started'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Name</label>
                                    <input
                                        type="text" required placeholder="Your full name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
                                <input
                                    type="email" required placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
                                <input
                                    type="password" required placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white rounded-lg py-3 text-sm font-semibold hover:bg-gray-800 transition-colors mt-2"
                            >
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-black font-semibold hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
