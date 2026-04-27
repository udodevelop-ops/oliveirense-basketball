import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-oliv-border bg-[#080810]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="UDO"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="font-bold tracking-[2px] text-[13px]">
            OLIVEIRENSE BASQUETEBOL
          </span>
        </div>
        <div className="text-gray-600 text-xs">
          © {new Date().getFullYear()} U.D. Oliveirense — Secção de Basquetebol
        </div>
      </div>
    </footer>
  );
}
