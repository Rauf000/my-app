import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const e = { email: '', password: '' };
    if (!email.trim()) e.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Неверный формат email';
    if (!password) e.password = 'Введите пароль';
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = login(email, password);
    if (result.ok) {
      toast.success('Добро пожаловать!');
      navigate(-1);
    } else {
      toast.error(result.error);
      setErrors(prev => ({ ...prev, password: result.error ?? '' }));
    }
  };

  const handleGoogle = () => toast.info('Вход через Google скоро будет доступен');

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Вход</h1>
          <button onClick={() => navigate('/registration')} className="text-[#4CAF50] font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors text-sm">
            Регистрация
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Logo mark */}
          <div className="text-center mb-8">
            <div className="size-16 rounded-2xl bg-[#4CAF50] flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
            <p className="text-gray-500 text-sm">Войдите в свой аккаунт RentHome</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:border-[#4CAF50] focus:outline-none transition-colors`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  className={`w-full px-4 py-3 bg-white rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:border-[#4CAF50] focus:outline-none transition-colors pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => toast.info('Восстановление пароля скоро будет доступно')} className="text-sm text-[#4CAF50] hover:underline">
                Забыли пароль?
              </button>
            </div>

            <button type="submit" className="w-full bg-[#4CAF50] text-white py-3.5 rounded-xl font-medium hover:bg-[#45a049] transition-colors shadow-sm mt-2">
              Войти
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-[#F5F7FA] text-gray-400 text-sm">или</span></div>
            </div>

            {/* Google */}
            <button type="button" onClick={handleGoogle} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Войти через Google
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => navigate('/registration')} className="text-gray-500 text-sm hover:text-[#4CAF50] transition-colors">
                Нет аккаунта?{' '}
                <span className="text-[#4CAF50] font-medium">Зарегистрироваться</span>
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
