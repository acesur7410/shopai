import { BASE } from './api';

// /uploads/... şeklindeki relative URL'leri tam URL'ye çevirir
export function imgUrl(src) {
  if (!src) return 'https://placehold.co/400x400/eee/999?text=Ürün';
  if (src.startsWith('http')) return src;          // zaten tam URL
  return `${BASE}${src}`;                          // /uploads/... → http://localhost:5000/uploads/...
}
