import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function ClubePage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("club_settings")
    .select("*");

  const get = (key: string) =>
    settings?.find((s) => s.key === key)?.value ?? "";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl tracking-[3px] mb-8">O Clube</h1>

      <div className="flex flex-col gap-6">
        <div className="bg-oliv-card rounded-xl p-8 border border-oliv-border">
          <div className="text-oliv-navy text-[13px] font-bold uppercase tracking-[2px] mb-3">
            A Nossa História
          </div>
          <p className="text-gray-400 leading-relaxed text-[15px]">
            {get("about_history")}
          </p>
        </div>

        <div className="bg-oliv-card rounded-xl p-8 border border-oliv-border">
          <div className="text-oliv-navy text-[13px] font-bold uppercase tracking-[2px] mb-3">
            Missão & Visão
          </div>
          <p className="text-gray-400 leading-relaxed text-[15px]">
            {get("about_mission")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["500+", "Atletas formados", "text-oliv-red"],
            ["15", "Equipas ativas", "text-oliv-navy"],
            ["30+", "Anos de história", "text-oliv-red"],
            ["1", "Família", "text-oliv-navy"],
          ].map(([value, label, color]) => (
            <div
              key={label}
              className="bg-oliv-card rounded-xl p-6 text-center border border-oliv-border"
            >
              <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
