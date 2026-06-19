import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';

export function Registration() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });

  const validateForm = () => {
    const e = { name: '', phone: '', email: '', password: '', confirmPassword: '' };
    let ok = true;
    if (!formData.name.trim()) { e.name = 'Введите имя'; ok = false; }
    if (!formData.phone.trim()) { e.phone = 'Введите номер телефона'; ok = false; }
    if (!formData.email.trim()) { e.email = 'Введите email'; ok = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { e.email = 'Неверный формат email'; ok = false; }
    if (!formData.password) { e.password = 'Введите пароль'; ok = false; }
    else if (formData.password.length < 6) { e.password = 'Пароль должен быть не менее 6 символов'; ok = false; }
    if (formData.password !== formData.confirmPassword) { e.confirmPassword = 'Пароли не совпадают'; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) { toast.error('Пожалуйста, примите условия соглашения'); return; }
    if (!validateForm()) return;

    const result = register({ name: formData.name, phone: formData.phone, email: formData.email, password: formData.password });
    if (result.ok) {
      toast.success('Регистрация успешна! Добро пожаловать в RentHome!');
      setTimeout(() => navigate('/'), 1200);
    } else {
      toast.error(result.error);
      setErrors(prev => ({ ...prev, email: result.error ?? '' }));
    }
  };

  const set = (field: string, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (errors[field as keyof typeof errors]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const inputClass = (err: string) =>
    `w-full px-4 py-3 bg-white rounded-xl border ${err ? 'border-red-400' : 'border-gray-200'} focus:border-[#4CAF50] focus:outline-none transition-colors`;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Регистрация</h1>
          <button onClick={() => navigate('/login')} className="text-[#4CAF50] font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors text-sm">
            Вход
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Имя</label>
            <input type="text" placeholder="Ваше имя" value={formData.name} onChange={e => set('name', e.target.value)} className={inputClass(errors.name)} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Номер телефона</label>
            <input type="tel" placeholder="+7 (999) 999-99-99" value={formData.phone} onChange={e => set('phone', e.target.value)} className={inputClass(errors.phone)} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input type="email" placeholder="example@mail.ru" value={formData.email} onChange={e => set('email', e.target.value)} className={inputClass(errors.email)} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Пароль</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={e => set('password', e.target.value)} className={`${inputClass(errors.password)} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Повторите пароль</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className={`${inputClass(errors.confirmPassword)} pr-12`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="remember" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="size-4 accent-[#4CAF50]" />
            <label htmlFor="remember" className="text-sm text-gray-700">Запомнить меня</label>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="size-4 accent-[#4CAF50] mt-0.5" />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Я принимаю условия{' '}
              <a href="#" onClick={e => { e.preventDefault(); toast.info('Пользовательское соглашение'); }} className="text-[#4CAF50] hover:underline">Пользовательского соглашения</a>
              {' '}и{' '}
              <a href="#" onClick={e => { e.preventDefault(); toast.info('Политика конфиденциальности'); }} className="text-[#4CAF50] hover:underline">Политики конфиденциальности</a>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-[#4CAF50] text-white py-3.5 rounded-xl font-medium hover:bg-[#45a049] transition-colors mt-4 shadow-sm">
            Зарегистрироваться
          </button>

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-[#F5F7FA] text-gray-400 text-sm">Или войдите через</span></div>
          </div>

          {/* Google */}
          <button type="button" onClick={() => toast.info('Вход через Google скоро будет доступен')} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm">
            <svg className="size-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => navigate('/login')} className="text-gray-500 text-sm hover:text-[#4CAF50] transition-colors">
              Уже есть аккаунт? <span className="text-[#4CAF50] font-medium">Войти</span>
            </button>
          </div>

        </motion.form>
      </main>
    </div>
  );
}
