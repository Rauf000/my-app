import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

interface PropertyCardProps {
  id: string;
  address: string;
  price: string;
  amenities: string[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function PropertyCard({ id, address, price, amenities, isFavorite = false, onToggleFavorite }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/property/${id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
        <span className="text-5xl">🏠</span>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`size-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-gray-800 mb-2">{address}</h3>

        <div className="text-[#E74C3C] mb-3 text-lg font-bold">{price}</div>

        {/* Amenities Tags */}
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
