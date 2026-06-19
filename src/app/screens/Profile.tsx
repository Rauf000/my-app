import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { BottomNavigation } from '../components/BottomNavigation';
import { useUser } from '../context/UserContext';

const menuItems = [
  { icon: Bell, label: 'Уведомления', sublabel: 'Включены' },
  { icon: Shield, label: 'Безопасность', sublabel: 'Настройки пароля' },
  { icon: Settings, label: 'Настройки', sublabel: 'Язык, тема' },
  { icon: HelpCircle, label: 'Поддержка', sublabel: 'Связаться с нами' },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getAvatarColor(email: string) {
  const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF5722', '#FF9800'];
  let hash = 0;
  for (const c of email) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
  return colors[hash];
}

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из аккаунта');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1A1A2E]">Профиль</h1>
          {user && (
            <button onClick={() => toast.info('Редактирование профиля скоро будет доступно')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit3 className="size-5 text-gray-500" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Profile Card */}
        {user ? (
          <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div
              className="size-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
              style={{ background: getAvatarColor(user.email) }}
            >
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#1A1A2E] truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              {user.phone && <p className="text-sm text-gray-400 truncate">{user.phone}</p>}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User className="size-10 text-gray-300" />
            </div>
            <p className="text-[#1A1A2E] font-semibold mb-1">Вы не вошли</p>
            <p className="text-gray-500 text-sm mb-5">Войдите, чтобы сохранять избранное и писать владельцам</p>
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="flex-1 py-3 bg-[#4CAF50] text-white rounded-xl text-sm font-medium hover:bg-[#45a049] transition-colors">
                Войти
              </button>
              <button onClick={() => navigate('/registration')} className="flex-1 py-3 border border-[#4CAF50] text-[#4CAF50] rounded-xl text-sm font-medium hover:bg-green-50 transition-colors">
                Регистрация
              </button>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => toast.info(`${item.label} — раздел в разработке`)}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left ${index < menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="size-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A2E]">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sublabel}</p>
                </div>
                <ChevronRight className="size-4 text-gray-300" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        {user && (
          <button onClick={handleLogout} className="w-full bg-white rounded-xl shadow-sm px-5 py-4 flex items-center gap-4 hover:bg-red-50 transition-colors">
            <div className="size-9 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut className="size-5 text-red-500" />
            </div>
            <span className="font-medium text-sm text-red-500">Выйти из аккаунта</span>
          </button>
        )}

        <p className="text-center text-xs text-gray-400 pt-2">RentHome v1.0.0</p>
      </main>

      <BottomNavigation />
    </div>
  );
}
