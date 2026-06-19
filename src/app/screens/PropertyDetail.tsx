import { ArrowLeft, Heart, Share2, MapPin, Bed, Maximize, Phone, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { properties } from '../data/properties';
import { useUser } from '../context/UserContext';
import { ensureChat } from '../data/chatStore';

function YandexMap({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const encoded = encodeURIComponent(address);
  const src = `https://yandex.ru/maps/?ll=${lng},${lat}&z=16&l=map&pt=${lng},${lat},pm2rdm&text=${encoded}&mode=whatshere`;
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200">
      <iframe src={src} width="100%" height="100%" frameBorder="0" allowFullScreen title="Yandex Map" className="w-full h-full" />
    </div>
  );
}

export function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [favorite, setFavorite] = useState(false);

  const property = properties.find(p => p.id === id) ?? properties[0];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: property.address, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
      toast.success('Ссылка скопирована!');
    }
  };

  const handleCall = () => toast.success(`Звонок владельцу: ${property.ownerName}`);

  const handleMessage = () => {
    if (!user) {
      toast.error('Войдите в аккаунт, чтобы написать владельцу');
      navigate('/login');
      return;
    }
    ensureChat(property.id, property.address, property.ownerName, property.ownerColor);
    navigate(`/chat/${property.id}`);
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toast.success('Заявка на просмотр отправлена!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="size-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-[#1A1A2E]">Детали</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setFavorite(!favorite)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className={`size-6 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="size-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto pb-36">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Image */}
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-64 flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-2">🏠</div>
              <p className="text-sm">Фото недоступно</p>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">{property.address}</h2>
              <div className="text-[#E74C3C] text-2xl font-bold">{property.price}</div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <Bed className="size-5 text-[#4CAF50]" />
                <span className="text-gray-700 text-sm">{property.rooms} комн.</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="size-5 text-[#4CAF50]" />
                <span className="text-gray-700 text-sm">{property.area} м²</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-[#4CAF50]" />
                <span className="text-gray-700 text-sm">{property.floor}/{property.totalFloors} эт.</span>
              </div>
            </div>

            {/* Owner */}
            <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-xl">
              <div className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: property.ownerColor }}>
                {property.ownerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A2E] text-sm">{property.ownerName}</p>
                <p className="text-xs text-gray-500">Владелец · На сайте</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-[#1A1A2E] mb-2">Описание</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-bold text-[#1A1A2E] mb-3">Удобства</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="text-sm bg-[#F5F7FA] text-gray-700 px-4 py-2 rounded-full border border-gray-200">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Yandex Map */}
            <div>
              <h3 className="font-bold text-[#1A1A2E] mb-3">На карте</h3>
              <YandexMap lat={property.lat} lng={property.lng} address={property.address} />
              <a
                href={`https://yandex.ru/maps/?ll=${property.lng},${property.lat}&z=16&pt=${property.lng},${property.lat},pm2rdm`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-2 text-sm text-[#4CAF50] hover:underline"
              >
                <MapPin className="size-4" />
                Открыть в Яндекс Картах
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Contact Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-3">
          <button onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 bg-[#4CAF50] text-white py-3.5 rounded-xl font-medium hover:bg-[#45a049] transition-colors shadow-sm">
            <Phone className="size-5" />
            Позвонить
          </button>
          <button onClick={handleMessage} className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#4CAF50] text-[#4CAF50] py-3.5 rounded-xl font-medium hover:bg-green-50 transition-colors">
            <MessageCircle className="size-5" />
            Написать
          </button>
        </div>
        <div className="max-w-md mx-auto mt-2">
          <button onClick={handleContact} className="w-full text-center text-sm text-gray-500 hover:text-[#4CAF50] py-1 transition-colors">
            Оставить заявку на просмотр
          </button>
        </div>
      </div>
    </div>
  );
}
