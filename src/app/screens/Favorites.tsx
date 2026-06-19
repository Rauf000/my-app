import { Heart } from 'lucide-react';
import { useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { properties } from '../data/properties';

export function Favorites() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(properties.map(p => [p.id, p.isFavorite]))
  );

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const favorited = properties.filter(p => favorites[p.id]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[#1A1A2E]">Избранное</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {favorited.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="size-16 text-gray-200 mx-auto mb-4" />
            <p className="font-medium text-gray-500">Нет избранных</p>
            <p className="text-sm text-gray-400 mt-1">
              Нажмите ❤️ на объявлении, чтобы добавить в избранное
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Сохранено: {favorited.length}</p>
            {favorited.map(p => (
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
