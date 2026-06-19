import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { properties } from '../data/properties';

type SortOption = 'default' | 'price_asc' | 'price_desc';

export function PropertyList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxRooms, setMaxRooms] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(properties.map(p => [p.id, p.isFavorite]))
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchIconClick = () => {
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const parsePrice = (price: string) => {
    const num = price.replace(/\D/g, '');
    return parseInt(num, 10) || 0;
  };

  const filtered = properties
    .filter(p =>
      searchQuery === '' ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(p => maxRooms === null || p.rooms <= maxRooms)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price_desc') return parsePrice(b.price) - parsePrice(a.price);
      return 0;
    });

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFiltersCount = (maxRooms !== null ? 1 : 0) + (sortBy !== 'default' ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-[#1A1A2E]">RentHome</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSearchIconClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="size-5 text-gray-600" />
              </button>
              <button
                onClick={() => setFilterOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SlidersHorizontal className="size-5 text-gray-600" />
                {activeFiltersCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#4CAF50] text-white text-[10px] rounded-full size-4 flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Поиск квартир..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#F5F7FA] rounded-lg border border-transparent focus:border-[#4CAF50] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Property Cards */}
      <main className="max-w-md mx-auto px-4 py-4">
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(property => (
              <PropertyCard
                key={property.id}
                {...property}
                isFavorite={favorites[property.id]}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium text-gray-500">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Filter Backdrop */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* Filter Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: filterOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl"
      >
        <div className="max-w-md mx-auto p-6">
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#1A1A2E]">Фильтры</h2>
            <button onClick={() => setFilterOpen(false)}>
              <X className="size-5 text-gray-500" />
            </button>
          </div>

          {/* Rooms filter */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Количество комнат</p>
            <div className="flex gap-2">
              {([null, 1, 2, 3] as const).map(val => (
                <button
                  key={val ?? 'all'}
                  onClick={() => setMaxRooms(val)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    maxRooms === val
                      ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#4CAF50]'
                  }`}
                >
                  {val === null ? 'Все' : val === 3 ? '3+' : `${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Сортировка</p>
            <div className="space-y-2">
              {[
                { value: 'default' as SortOption, label: 'По умолчанию' },
                { value: 'price_asc' as SortOption, label: 'Сначала дешевле' },
                { value: 'price_desc' as SortOption, label: 'Сначала дороже' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between ${
                    sortBy === opt.value
                      ? 'bg-green-50 border-[#4CAF50] text-[#4CAF50] font-medium'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <span className="size-4 rounded-full bg-[#4CAF50] flex items-center justify-center">
                      <span className="size-2 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setMaxRooms(null); setSortBy('default'); }}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Сбросить
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="flex-1 py-3 bg-[#4CAF50] text-white rounded-xl text-sm font-medium hover:bg-[#45a049] transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
