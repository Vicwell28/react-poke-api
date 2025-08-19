import { useEffect, useState } from "react";
import pokemonImage from "@assets/images/pokemon.webp";
import questionMarkImage from "@assets/images/question-mark.webp";
import { getPokemonTypeColor } from "@/utils/pokemonTypeColors";

export function PokemonCard({ pokemon, delay = 0, hoveredId, setHoveredId }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const typeColors = getPokemonTypeColor(pokemon.types[0])?.bg || "bg-gray-500";

  const isHovered = hoveredId === pokemon.id;
  const shouldFlip = loading || (!isHovered && hoveredId !== null);

  const scaleClass = isHovered
    ? "scale-105 z-10"
    : hoveredId !== null
    ? "scale-95 opacity-90"
    : "scale-100";

  return (
    <div
      className={`w-80 h-120 perspective-distant transition-transform duration-300 ${scaleClass}`}
      onMouseEnter={() => setHoveredId(pokemon.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-3d cursor-pointer ${
          shouldFlip ? "rotate-y-180" : ""
        }`}
      >
        {/* Frente */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden backface-hidden border-2 ${typeColors}`}
        >
          <div className="flex justify-between items-center px-4 py-2 bg-black/20">
            <span className="text-sm font-semibold text-white drop-shadow">
              #{pokemon.id || "000"}
            </span>
            <span className="text-xs text-yellow-300 italic">Pokémon Card</span>
          </div>

          <div className="flex justify-center items-center h-44 relative">
            <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <img
              src={pokemon.image || pokemonImage}
              alt={pokemon.name || "pokemon"}
              className="h-36 object-contain z-10 animate-fadeIn"
              loading="lazy"
            />
          </div>

          <div className="p-4 text-white">
            <h2 className="text-2xl font-bold capitalize text-center drop-shadow-md">
              {pokemon.name || "???"}
            </h2>

            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {pokemon.types.length > 0 ? (
                pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-white/90 to-gray-200 text-gray-800 shadow-md"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">
                  ??
                </span>
              )}
            </div>

            <div className="my-3 border-t border-white/30"></div>

            <div className="space-y-2 text-sm">
              {[
                { label: "HP", value: pokemon.hp },
                { label: "Ataque", value: pokemon.attack },
                { label: "Defensa", value: pokemon.defense },
                { label: "Velocidad", value: pokemon.speed },
              ].map((stat) => {
                const maxStat = 255;
                const percent = Math.min((stat.value / maxStat) * 100, 100);

                return (
                  <div key={stat.label}>
                    <p className="flex justify-between">
                      <span className="font-semibold">{stat.label}:</span>
                      <span className="font-semibold">{stat.value}</span>
                    </p>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-black/50 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden backface-hidden animate-pulse rotate-y-180 bg-gradient-to-br from-[#EA2A43] to-[#FF6B6B] border-2">
          <div className="h-[80%] w-full flex items-center justify-center p-5">
            <img
              src={questionMarkImage}
              alt="questionMarkImage"
              className="max-h-full object-contain"
            />
          </div>
          <div className="h-[20%] w-full flex items-center justify-center px-5 pb-5">
            <img
              src={pokemonImage}
              alt="pokemonImage"
              className="max-h-full object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
