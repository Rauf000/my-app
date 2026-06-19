import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { properties } from '../data/properties';

export function Search() {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(properties.map(p => [p.id, p.isFavorite]))
  );

  const results = query.trim()
    ? properties.filter(p =>
        p.address.toLowerCase().includes(query.toLowerCase()) ||
        p.amenities.some(a => a.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[#1A1A2E] mb-3">Поиск</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Введите адрес или район..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#F5F7FA] rounded-lg border border-transparent focus:border-[#4CAF50] focus:outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {!query && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium text-gray-500">Начните вводить запрос</p>
            <p className="text-sm mt-1">Поиск по адресу или удобствам</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">😔</div>
            <p className="font-medium text-gray-500">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте другой запрос</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Найдено: {results.length}</p>
            {results.map(p => (
              <PropertyCard
                key={p.id}
                {...p}
                isFavorite={favorites[p.id]}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
