import { CharacterView } from "@/components/character-view";
import { SiteHeader } from "@/components/site-header";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <CharacterView characterKey={key} />
      </main>
    </div>
  );
}
