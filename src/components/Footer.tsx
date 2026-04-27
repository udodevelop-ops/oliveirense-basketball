import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#191c1d" }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand + Redes Sociais */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="UDO" width={40} height={40} className="object-contain" />
              <div className="font-display font-extrabold text-white text-sm leading-tight">
                OLIVEIRENSE<br />
                <span className="text-oliv-red text-[10px] tracking-widest">BASQUETEBOL</span>
              </div>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
              Representando o espirito e a paixao de Oliveira de Azemeis. A casa dos bravos.
            </p>

            {/* Redes Sociais */}
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)" }}
                title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#fff" stroke="none"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)" }}
                title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)" }}
                title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#191c1d"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)" }}
                title="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Clube */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">CLUBE</h4>
            {[
              ["O Clube", "/clube"],
              ["Palmares", "/clube/palmares"],
              ["Plantel", "/plantel"],
              ["Calendario", "/calendario"],
              ["Contacta-nos", "/clube"],
            ].map(([l, h]) => (
              <Link key={l} href={h} className="block text-gray-500 text-[13px] hover:text-white transition-colors mb-2">{l}</Link>
            ))}
          </div>

          {/* Equipas */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">EQUIPAS</h4>
            {[
              ["Equipa Senior", "/plantel/senior"],
              ["Sub-18", "/plantel/sub-18"],
              ["Sub-16", "/plantel/sub-16"],
              ["Sub-14", "/plantel/sub-14"],
              ["Sub-12", "/plantel/sub-12"],
            ].map(([l, h]) => (
              <Link key={l} href={h} className="block text-gray-500 text-[13px] hover:text-white transition-colors mb-2">{l}</Link>
            ))}
          </div>

          {/* Noticias */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">INFORMACAO</h4>
            {[
              ["Noticias", "/noticias"],
              ["Resultados", "/calendario"],
              ["Proximos Jogos", "/calendario"],
              ["Patrocinadores", "/clube"],
            ].map(([l, h]) => (
              <Link key={l} href={h} className="block text-gray-500 text-[13px] hover:text-white transition-colors mb-2">{l}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-gray-600 text-[12px]">
            2024 Oliveirense Basquetebol. Todos os direitos reservados.
          </div>
          <div className="flex gap-4 text-[12px] text-gray-600">
            <Link href="/clube" className="hover:text-white transition-colors">Politica de Privacidade</Link>
            <Link href="/clube" className="hover:text-white transition-colors">Termos de Servico</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
