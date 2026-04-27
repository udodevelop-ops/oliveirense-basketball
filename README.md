# 🏀 Oliveirense Basquetebol

Site oficial da secção de basquetebol da U.D. Oliveirense.  
Built with **Next.js 14**, **Supabase**, **Tailwind CSS**, deployed on **Vercel**.

## Começar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copia o ficheiro de exemplo e preenche com as credenciais do Supabase:

```bash
cp .env.example .env.local
```

Edita `.env.local` com os valores do teu projeto Supabase (Settings → API).

### 3. Executar localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Deploy no Vercel

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

O Vercel faz deploy automático quando deteta push no GitHub.

## Estrutura

- `/src/app/` — Páginas (App Router)
- `/src/components/` — Componentes reutilizáveis
- `/src/lib/` — Supabase clients + tipos TypeScript
- `/public/` — Assets estáticos (logo)

## Admin

Acede via `/admin`. Requer conta criada no Supabase Auth + entrada na tabela `admin_profiles`.

## Cores do clube

| Cor | Hex | Uso |
|-----|-----|-----|
| Vermelho | `#C8102E` | Destaques, CTAs |
| Azul marinho | `#1C3A6B` | Navegação, badges, acentos |
| Preto | `#0D0D0D` | Background principal |
