import { useState } from "react";
import { mockPokemons } from "@/utils/mocks";
import { PokemonCard } from "@/components/ui/PokemonCard";

export default function PokemonPage() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="flex flex-wrap justify-center gap-6 min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      {mockPokemons.map((pokemon, i) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          delay={i * 300}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      ))}
    </div>
  );
}
