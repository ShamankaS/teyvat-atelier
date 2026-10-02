import { CharacterView } from "@/components/character-view";
import { SiteHeader } from "@/components/site-header";
import { CHARACTERS } from "@/data/characters";
import { elementPageStyle } from "@/data/element-theme";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const element = CHARACTERS[key]?.element;

  return (
    <div
      className="relative flex min-h-full flex-1 flex-col"
      style={elementPageStyle(element)}
    >
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <CharacterView characterKey={key} />
      </main>
    </div>
  );
}
