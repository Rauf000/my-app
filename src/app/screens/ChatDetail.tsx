import { ArrowLeft, Send, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { getChat, sendMessage, ChatThread } from '../data/chatStore';

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ color, name }: { color: string; name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs" style={{ background: color }}>
      {initials}
    </div>
  );
}

export function ChatDetail() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (propertyId) setThread(getChat(propertyId));
  }, [user, propertyId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length]);

  const handleSend = () => {
    if (!text.trim() || !propertyId || sending) return;
    setSending(true);
    const updated = sendMessage(propertyId, text.trim());
    setText('');
    if (updated) {
      setThread({ ...updated });
      setTimeout(() => {
        // Reload to get auto-reply
        const fresh = getChat(propertyId);
        if (fresh) setThread({ ...fresh });
        setSending(false);
      }, 1600);
    } else {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-gray-400">Чат не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/chat')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="size-5 text-gray-700" />
          </button>
          <Avatar color={thread.ownerColor} name={thread.ownerName} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1A1A2E] text-sm leading-tight">{thread.ownerName}</p>
            <p className="text-xs text-gray-400 truncate">{thread.propertyAddress}</p>
          </div>
          <button onClick={() => toast.success('Звонок владельцу...')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="size-5 text-[#4CAF50]" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 py-4 space-y-3 pb-24">
        {thread.messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!msg.fromMe && <Avatar color={thread.ownerColor} name={thread.ownerName} />}
            <div className={`max-w-[75%] ${msg.fromMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.fromMe
                  ? 'bg-[#4CAF50] text-white rounded-br-sm'
                  : 'bg-white text-[#1A1A2E] rounded-bl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 px-1">{timeLabel(msg.time)}</span>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-end gap-2 flex-row-reverse">
            <div className="max-w-[75%] flex flex-col items-end gap-1">
              <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#4CAF50]/60 text-white text-sm">
                <span className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="size-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Введите сообщение..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 bg-[#F5F7FA] rounded-full border border-transparent focus:border-[#4CAF50] focus:outline-none text-sm transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="size-10 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0 hover:bg-[#45a049] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="size-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
