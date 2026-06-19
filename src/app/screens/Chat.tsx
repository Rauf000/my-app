import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { getAllChats, ChatThread } from '../data/chatStore';
import { BottomNavigation } from '../components/BottomNavigation';

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return 'только что';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} мин`;
  if (diff < 86_400_000) return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
}

function Bubble({ color, name }: { color: string; name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="size-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: color }}>
      {initials}
    </div>
  );
}

export function Chat() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [chats, setChats] = useState<ChatThread[]>([]);

  useEffect(() => {
    if (user) setChats(getAllChats());
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-[#1A1A2E]">Чат</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center">
            <MessageCircle className="size-10 text-gray-300" />
          </div>
          <div>
            <p className="font-semibold text-[#1A1A2E] mb-1">Войдите, чтобы писать</p>
            <p className="text-sm text-gray-500">Переписка с владельцами доступна после входа в аккаунт</p>
          </div>
          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={() => navigate('/login')} className="flex-1 py-3 bg-[#4CAF50] text-white rounded-xl text-sm font-medium hover:bg-[#45a049] transition-colors">
              Войти
            </button>
            <button onClick={() => navigate('/registration')} className="flex-1 py-3 border border-[#4CAF50] text-[#4CAF50] rounded-xl text-sm font-medium hover:bg-green-50 transition-colors">
              Регистрация
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[#1A1A2E]">Чат</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <MessageCircle className="size-14 text-gray-200 mb-4" />
            <p className="font-medium text-gray-500">Нет сообщений</p>
            <p className="text-sm text-gray-400 mt-1">Откройте объявление и нажмите «Написать»</p>
          </div>
        ) : (
          <div className="bg-white divide-y divide-gray-100">
            {chats.map((chat, i) => {
              const last = chat.messages.at(-1);
              return (
                <motion.button
                  key={chat.propertyId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/chat/${chat.propertyId}`)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <Bubble color={chat.ownerColor} name={chat.ownerName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-[#1A1A2E] text-sm truncate">{chat.ownerName}</span>
                      {last && <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{timeLabel(last.time)}</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-0.5">{chat.propertyAddress}</p>
                    {last && (
                      <p className={`text-sm truncate ${!last.fromMe ? 'font-medium text-[#1A1A2E]' : 'text-gray-500'}`}>
                        {last.fromMe ? 'Вы: ' : ''}{last.text}
                      </p>
                    )}
                  </div>
                  {last && !last.fromMe && (
                    <span className="size-2.5 rounded-full bg-[#4CAF50] flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
