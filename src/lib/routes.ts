export interface Route {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  via?: string;
}

export const ROUTES: Route[] = [
  { id: 'bkl-plm', from: 'Bengkulu', to: 'Palembang', price: 250000, duration: '8–10 jam' },
  { id: 'plm-bkl', from: 'Palembang', to: 'Bengkulu', price: 250000, duration: '8–10 jam' },
  { id: 'bkl-jmb', from: 'Bengkulu', to: 'Jambi', price: 250000, duration: '9–12 jam' },
  { id: 'jmb-bkl', from: 'Jambi', to: 'Bengkulu', price: 250000, duration: '9–12 jam' },
  { id: 'bkl-crp', from: 'Bengkulu', to: 'Curup', price: 80000, duration: '2–2,5 jam' },
  { id: 'crp-bkl', from: 'Curup', to: 'Bengkulu', price: 80000, duration: '2–2,5 jam' },
  { id: 'crp-bnd', from: 'Curup', to: 'Bandara Bengkulu', price: 150000, duration: '2–2,5 jam' },
  { id: 'bnd-crp', from: 'Bandara Bengkulu', to: 'Curup', price: 150000, duration: '2–2,5 jam' },
  { id: 'bkl-lbg', from: 'Bengkulu', to: 'Lebong', price: 100000, duration: '3–4 jam', via: 'Bengkulu Utara' },
  { id: 'lbg-bkl', from: 'Lebong', to: 'Bengkulu', price: 100000, duration: '3–4 jam', via: 'Bengkulu Utara' },
  { id: 'bkl-lmp', from: 'Bengkulu', to: 'Lampung', price: 300000, duration: '11–13 jam', via: 'Liwa' },
  { id: 'lmp-bkl', from: 'Lampung', to: 'Bengkulu', price: 300000, duration: '11–13 jam', via: 'Liwa' },
];

export function getRouteById(id: string): Route | undefined {
  return ROUTES.find(r => r.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}
