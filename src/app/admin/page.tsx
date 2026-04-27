"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou password incorretos");
      setLoading(false);
      return;
    }

    // Verificar se é admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        setError("Sem permissões de administrador");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
    }

    router.push("/admin/noticias");
    router.refresh();
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-6">
      <div className="bg-oliv-card rounded-2xl p-12 text-center border border-oliv-border max-w-[400px] w-full">
        <Image
          src="/logo.png"
          alt="UDO"
          width={64}
          height={64}
          className="rounded-full border-2 border-oliv-navy object-cover mx-auto"
        />
        <h2 className="text-2xl font-extrabold tracking-[2px] mt-5 mb-1">
          BACKOFFICE
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Acesso restrito à administração
        </p>

        <form onSubmit={handleLogin} className="text-left">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-oliv-dark border border-oliv-border text-white px-3.5 py-3 rounded-lg text-sm focus:border-oliv-navy outline-none transition-colors"
            required
          />

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-oliv-dark border border-oliv-border text-white px-3.5 py-3 rounded-lg text-sm focus:border-oliv-navy outline-none transition-colors"
            required
          />

          {error && (
            <p className="text-oliv-red text-[13px] mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white py-3 rounded-lg text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
