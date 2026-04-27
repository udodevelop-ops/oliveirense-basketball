import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t" style={{ background: "#0F0F11", borderColor: "#2E2E36" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="UDO" width={40} height={40} className="object-contain" />
            <div>
              <div className="font-bold tracking-[2px] text-[13px] text-white">OLIVEIRENSE BASQUETEBOL</div>
              <div className="text-[11px] mt-0.5" style={{ color: "#555560" }}>U.D. Oliveirense — Secção de Basquetebol</div>
            </div>
          </div>
          <div className="flex gap-6 text-[12px] font-semibold" style={{ color: "#555560" }}>
            <Link href="/clube" className="hover:text-white transition-colors">Clube</Link>
            <Link href="/plantel" className="hover:text-white transition-colors">Plantel</Link>
            <Link href="/calendario" className="hover:text-white transition-colors">Calendário</Link>
            <Link href="/noticias" className="hover:text-white transition-colors">Notícias</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex justify-between items-center flex-wrap gap-3" style={{ borderColor: "#1C1C20" }}>
          <div className="text-[11px]" style={{ color: "#3A3A44" }}>
            © {new Date().getFullYear()} U.D. Oliveirense. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
