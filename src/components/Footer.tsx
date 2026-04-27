import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#191c1d" }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="UDO" width={40} height={40} className="object-contain" />
              <div className="font-display font-extrabold text-white text-sm leading-tight">
                OLIVEIRENSE<br />
                <span className="text-oliv-red text-[10px] tracking-widest">BASQUETEBOL</span>
              </div>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              Representing the spirit and passion of Oliveira de Azemeis since 1922. Home of the brave.
            </p>
          </div>

          {/* Clube */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">CLUBE</h4>
            {[["O Clube", "/clube"], ["Palmares", "/clube/palmares"], ["Plantel", "/plantel"], ["Contacto", "/clube"]].map(([l, h]) => (
              <Link key={l} href={h} className="block text-gray-500 text-[13px] hover:text-white transition-colors mb-2">{l}</Link>
            ))}
          </div>

          {/* Equipas */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">EQUIPAS</h4>
            {[["Senior", "/plantel/senior"], ["Sub-18", "/plantel/sub-18"], ["Sub-16", "/plantel/sub-16"], ["Sub-14", "/plantel/sub-14"]].map(([l, h]) => (
              <Link key={l} href={h} className="block text-gray-500 text-[13px] hover:text-white transition-colors mb-2">{l}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white text-[12px] uppercase tracking-[2px] mb-4">NEWSLETTER</h4>
            <p className="text-gray-500 text-[13px] mb-4">Fica a par de todas as noticias e resultados.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 px-3 py-2 rounded text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-oliv-red text-[13px]" />
              <button className="px-3 py-2 rounded text-sm font-bold text-white" style={{ background: "#bd001b" }}>JOIN</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-[12px]">
            2024 Oliveirense Basquetebol. All rights reserved.
          </div>
          <div className="flex gap-4 text-[12px] text-gray-600">
            <Link href="/clube" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/clube" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
