import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { News } from "@/lib/types";

export function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/noticias/${news.id}`}
      className="group block rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-oliv-navy"
      style={{ background: "#1C1C20", borderColor: "#2E2E36" }}>
      {/* Image */}
      <div className="h-44 overflow-hidden relative"
        style={{ background: news.image_url ? undefined : "linear-gradient(135deg, #1C3A6B 0%, #C8102E 100%)" }}>
        {news.image_url && (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${news.image_url})` }} />
        )}
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(28,58,107,0.9)", color: "#A0B8E0" }}>
            {news.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-gray-100 transition-colors line-clamp-2">
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "#8A8A96" }}>
            {news.subtitle}
          </p>
        )}
        <div className="text-xs" style={{ color: "#555560" }}>
          {format(new Date(news.date), "d MMM yyyy", { locale: pt })}
        </div>
      </div>
    </Link>
  );
}
