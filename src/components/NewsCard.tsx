import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { News } from "@/lib/types";

export function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/noticias/${news.id}`}
      className="group block bg-white rounded-lg overflow-hidden border border-oliv-surface-high hover:border-oliv-navy transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 4px rgba(53,87,188,0.04)" }}>
      <div className="h-44 overflow-hidden relative"
        style={{ background: news.image_url ? undefined : "linear-gradient(135deg, #3557bc, #bd001b)" }}>
        {news.image_url && (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${news.image_url})` }} />
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: "#3557bc" }}>
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-oliv-text leading-snug mb-1.5 group-hover:text-oliv-red transition-colors"
          style={{ fontSize: 16, letterSpacing: "-0.01em" }}>
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "#5d3f3d" }}>
            {news.subtitle}
          </p>
        )}
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#926e6b" }}>
          {format(new Date(news.date), "d MMM yyyy", { locale: pt })}
        </div>
      </div>
    </Link>
  );
}
