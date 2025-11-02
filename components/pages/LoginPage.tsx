
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'anisur' && password === 'anisur85@#') {
            setError('');
            alert('Login Successful');
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-4"
            style={{ background: `linear-gradient(to bottom, ${COLORS.primary}, #2c3e50)` }}
        >
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl p-8 text-white">
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
                
                {error && <p className="bg-red-500/50 text-center p-2 rounded-md mb-4">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block mb-1 font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="relative">
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-white/70 hover:text-white"
                            aria-label="Toggle password visibility"
                        >
                            <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded bg-white/30 border-none" />
                            Remember me
                        </label>
                        <a href="#" className="hover:underline">Forgot Password?</a>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 font-bold py-3 rounded-md transition-transform transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm">
                    <p className="font-semibold">Authorization Person Contact Info</p>
                    <p>For support, contact admin@pacific.com</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
