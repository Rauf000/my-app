export interface Property {
  id: string;
  address: string;
  price: string;
  amenities: string[];
  isFavorite: boolean;
  lat: number;
  lng: number;
  description: string;
  rooms: number;
  area: number;
  floor: number;
  totalFloors: number;
  ownerName: string;
  ownerColor: string;
}

export const properties: Property[] = [
  {
    id: '1',
    address: '1-к. квартира, 30м. кв., № 97/2',
    price: '2 000 ₽ в месяц',
    amenities: ['Балкон', 'Пешеходная улица, 5', 'Кондиционер', 'Интернет'],
    isFavorite: false,
    lat: 55.755819,
    lng: 37.617644,
    description: 'Уютная квартира в центре города с отличным ремонтом и всеми удобствами. Рядом метро, магазины, парки.',
    rooms: 1,
    area: 30,
    floor: 5,
    totalFloors: 9,
    ownerName: 'Алексей Иванов',
    ownerColor: '#4CAF50',
  },
  {
    id: '2',
    address: '1-к. квартира, 30м. кв., № 97/3',
    price: '2 000 ₽ в месяц',
    amenities: ['Балкон', 'Панорамные окна', 'Паркинг', 'Охрана'],
    isFavorite: true,
    lat: 55.751574,
    lng: 37.626659,
    description: 'Светлая квартира с панорамными окнами и великолепным видом на город. Рядом торговые центры и парк.',
    rooms: 1,
    area: 30,
    floor: 8,
    totalFloors: 12,
    ownerName: 'Марина Соколова',
    ownerColor: '#9C27B0',
  },
  {
    id: '3',
    address: '1-к. квартира, 30м. кв., № 97/4',
    price: '30 000 ₽ в месяц',
    amenities: ['Люксовая отделка', 'Центр города', 'Современный ремонт', 'Консьерж'],
    isFavorite: false,
    lat: 55.733799,
    lng: 37.635197,
    description: 'Роскошная квартира с дизайнерским ремонтом в самом сердце города. Премиальный жилой комплекс с консьерж-сервисом.',
    rooms: 1,
    area: 30,
    floor: 12,
    totalFloors: 16,
    ownerName: 'Дмитрий Козлов',
    ownerColor: '#FF5722',
  },
  {
    id: '4',
    address: '2-к. квартира, 45м. кв., № 15/8',
    price: '35 000 ₽ в месяц',
    amenities: ['Две комнаты', 'Большая кухня', 'Рядом метро', 'Парковка'],
    isFavorite: false,
    lat: 55.762278,
    lng: 37.608978,
    description: 'Просторная двухкомнатная квартира с большой кухней-гостиной. Удобная парковка, 5 минут до метро пешком.',
    rooms: 2,
    area: 45,
    floor: 3,
    totalFloors: 10,
    ownerName: 'Ольга Петрова',
    ownerColor: '#2196F3',
  },
];
