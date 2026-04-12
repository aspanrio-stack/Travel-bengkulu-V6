import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  href: string;
  badge?: string;
  image?: string;
}

export default function ServiceCard({ icon, title, description, price, href, badge, image }: ServiceCardProps) {
  return (
    <Link href={href} className="card group cursor-pointer block hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image area */}
      {image ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          {badge && (
            <span className="absolute top-3 left-3 badge bg-white/90 text-slate-700 shadow-sm text-xs">
              {badge}
            </span>
          )}
        </div>
      ) : (
        <div className="h-44 bg-primary-50 flex items-center justify-center relative">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          {badge && (
            <span className="absolute top-3 left-3 badge bg-white/90 text-slate-700 shadow-sm text-xs">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-slate-800 text-base mb-1.5 group-hover:text-primary-600 transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Mulai dari</p>
            <p className="text-primary-600 font-bold text-lg">{price}</p>
          </div>
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
