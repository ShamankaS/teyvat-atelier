import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black/20">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Teyvat Atelier
        </Link>
        <p className="text-xs text-muted-foreground sm:text-sm">Genshin Impact · локально</p>
      </div>
    </header>
  );
}
