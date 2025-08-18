export function getPokemonTypeColor(type) {
  const colors = {
    fire: {
      gradient: "from-red-500 to-orange-600",
      bg: "bg-red-500",
      text: "text-red-900",
    },
    water: {
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-500",
      text: "text-blue-900",
    },
    grass: {
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-500",
      text: "text-green-900",
    },
    electric: {
      gradient: "from-yellow-400 to-yellow-600",
      bg: "bg-yellow-400",
      text: "text-yellow-900",
    },
    psychic: {
      gradient: "from-pink-500 to-purple-600",
      bg: "bg-pink-500",
      text: "text-pink-900",
    },
    ice: {
      gradient: "from-cyan-300 to-blue-400",
      bg: "bg-cyan-300",
      text: "text-cyan-900",
    },
    dragon: {
      gradient: "from-purple-600 to-indigo-800",
      bg: "bg-purple-600",
      text: "text-purple-900",
    },
    dark: {
      gradient: "from-gray-800 to-black",
      bg: "bg-gray-800",
      text: "text-gray-200",
    },
    fairy: {
      gradient: "from-pink-300 to-pink-500",
      bg: "bg-pink-300",
      text: "text-pink-900",
    },
    fighting: {
      gradient: "from-red-700 to-red-900",
      bg: "bg-red-700",
      text: "text-red-200",
    },
    poison: {
      gradient: "from-purple-500 to-purple-700",
      bg: "bg-purple-500",
      text: "text-purple-900",
    },
    ground: {
      gradient: "from-yellow-600 to-orange-500",
      bg: "bg-yellow-600",
      text: "text-yellow-900",
    },
    flying: {
      gradient: "from-indigo-400 to-blue-500",
      bg: "bg-indigo-400",
      text: "text-indigo-900",
    },
    bug: {
      gradient: "from-green-400 to-lime-500",
      bg: "bg-green-400",
      text: "text-green-900",
    },
    rock: {
      gradient: "from-yellow-800 to-gray-600",
      bg: "bg-yellow-800",
      text: "text-yellow-200",
    },
    ghost: {
      gradient: "from-purple-700 to-indigo-900",
      bg: "bg-purple-700",
      text: "text-purple-200",
    },
    steel: {
      gradient: "from-gray-400 to-gray-600",
      bg: "bg-gray-400",
      text: "text-gray-900",
    },
    normal: {
      gradient: "from-gray-400 to-gray-500",
      bg: "bg-gray-400",
      text: "text-gray-900",
    },
  };

  return (
    colors[type?.toLowerCase()] || {
      gradient: "from-gray-400 to-gray-500",
      bg: "bg-gray-400",
      text: "text-gray-900",
    }
  );
}
