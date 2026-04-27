import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { News } from "@/lib/types";

export function NewsCard({ news }: { news: News }) {
  return (
    <Link
      href={`/noticias/${news.id}`}
      className="group block bg-oliv-card rounded-xl overflow-hidden border border-oliv-border hover:border-oliv-navy transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagem */}
      <div
        className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: news.image_url
            ? `url(${news.image_url})`
            : `linear-gradient(135deg, #1C3A6B, #C8102E)`,
        }}
      />

      {/* Conteúdo */}
      <div className="p-5">
        <span className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px]">
          {news.category}
        </span>
        <h3 className="text-base font-bold mt-2 mb-1.5 leading-snug">
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {news.subtitle}
          </p>
        )}
        <div className="text-xs text-gray-600 mt-3">
          {format(new Date(news.date), "d MMM yyyy", { locale: pt })}
        </div>
      </div>
    </Link>
  );
}
