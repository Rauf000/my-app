import { Home, Search, MessageCircle, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getTotalUnread } from '../data/chatStore';
import { useUser } from '../context/UserContext';

const navItems = [
  { id: 'home', icon: Home, label: 'Главная', path: '/' },
  { id: 'search', icon: Search, label: 'Поиск', path: '/search' },
  { id: 'chat', icon: MessageCircle, label: 'Чат', path: '/chat' },
  { id: 'favorites', icon: Heart, label: 'Избранное', path: '/favorites' },
  { id: 'profile', icon: User, label: 'Профиль', path: '/profile' },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) setUnread(getTotalUnread());
  }, [user, location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const showBadge = item.id === 'chat' && unread > 0 && user;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 py-2 px-3 transition-colors relative"
              >
                <div className="relative">
                  <Icon
                    className={`size-5 ${isActive ? 'text-[#4CAF50]' : 'text-gray-400'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 size-4 bg-[#E74C3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? 'text-[#4CAF50] font-semibold' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
