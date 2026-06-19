export interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string; // ISO
}

export interface ChatThread {
  propertyId: string;
  propertyAddress: string;
  ownerName: string;
  ownerColor: string;
  messages: ChatMessage[];
}

const KEY = 'renthome_chats';

function load(): ChatThread[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

function save(threads: ChatThread[]) {
  localStorage.setItem(KEY, JSON.stringify(threads));
}

export function getAllChats(): ChatThread[] {
  return load();
}

export function getChat(propertyId: string): ChatThread | null {
  return load().find(t => t.propertyId === propertyId) ?? null;
}

export function ensureChat(propertyId: string, propertyAddress: string, ownerName: string, ownerColor: string): ChatThread {
  const threads = load();
  const existing = threads.find(t => t.propertyId === propertyId);
  if (existing) return existing;

  const greeting: ChatMessage = {
    id: crypto.randomUUID(),
    text: `Здравствуйте! Меня интересует объект: ${propertyAddress}. Можете рассказать подробнее?`,
    fromMe: true,
    time: new Date().toISOString(),
  };
  const reply: ChatMessage = {
    id: crypto.randomUUID(),
    text: 'Добрый день! Конечно, готов ответить на ваши вопросы. Квартира в отличном состоянии, можем договориться о просмотре.',
    fromMe: false,
    time: new Date(Date.now() + 2000).toISOString(),
  };

  const thread: ChatThread = { propertyId, propertyAddress, ownerName, ownerColor, messages: [greeting, reply] };
  save([...threads, thread]);
  return thread;
}

export function sendMessage(propertyId: string, text: string): ChatThread | null {
  const threads = load();
  const idx = threads.findIndex(t => t.propertyId === propertyId);
  if (idx === -1) return null;

  const msg: ChatMessage = {
    id: crypto.randomUUID(),
    text,
    fromMe: true,
    time: new Date().toISOString(),
  };

  // Simulate an auto-reply after short delay
  const autoReplies = [
    'Хорошо, уточню и отвечу вам.',
    'Да, конечно! Звоните в любое время.',
    'Спасибо за интерес. Давайте договоримся о просмотре?',
    'Понял вас. Квартира свободна с ближайшего числа.',
    'Да, это возможно. Условия обсудим при встрече.',
  ];
  const reply: ChatMessage = {
    id: crypto.randomUUID(),
    text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
    fromMe: false,
    time: new Date(Date.now() + 1500).toISOString(),
  };

  threads[idx] = { ...threads[idx], messages: [...threads[idx].messages, msg, reply] };
  save(threads);
  return threads[idx];
}

export function getTotalUnread(): number {
  return load().reduce((acc, t) => {
    const last = t.messages.at(-1);
    return acc + (last && !last.fromMe ? 1 : 0);
  }, 0);
}
