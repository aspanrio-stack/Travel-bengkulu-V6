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
  className?: string;
}

export default function ServiceCard({ icon, title, description, price, href, badge, image, className = '' }: ServiceCardProps) {
  return (
    <Link href={href} role="listitem"
      className={`card group cursor-pointer block hover:-translate-y-1 transition-all duration-300 overflow-hidden ${className}`}>
      {/* Image area */}
      {image ? (
        <div className="relative h-32 md:h-40 w-full overflow-hidden bg-slate-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          {badge && (
            <span className="absolute top-2.5 left-2.5 badge bg-gold-400 text-primary-900 shadow-sm text-xs">
              {badge}
            </span>
          )}
          <h3 className="absolute inset-x-3 bottom-2.5 font-display font-bold text-white text-[15px] leading-snug drop-shadow">
            {title}
          </h3>
        </div>
      ) : (
        <div className="h-44 bg-primary-50 flex items-center justify-center relative">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          {badge && (
            <span className="absolute top-2.5 left-2.5 badge bg-gold-400 text-primary-900 shadow-sm text-xs">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {!image && (
          <h3 className="font-display font-bold text-slate-800 text-[15px] mb-1 group-hover:text-primary-600 transition-colors leading-snug">
            {title}
          </h3>
        )}
        <p className="text-slate-500 text-[13px] leading-relaxed mb-3 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Mulai dari</p>
            <p className="text-primary-700 font-bold text-base leading-tight">{price}</p>
          </div>
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
