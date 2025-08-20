import { ApiService } from "@services/api/ApiService.js";

/**
 * API de Pokemon
 * Configurada para consumir la API pública de Pokemon
 *
 * @type {ApiService}
 * @example
 * // Obtener información de un Pokemon específico
 * const pikachu = await pokemonApi.get('/pokemon/pikachu');
 *
 * // Obtener lista de Pokemon con paginación
 * const pokemonList = await pokemonApi.get('/pokemon', {
 *   params: { limit: 20, offset: 0 }
 * });
 *
 * // Obtener información de una especie
 * const species = await pokemonApi.get('/pokemon-species/1');
 */
export const pokemonApi = new ApiService("https://pokeapi.co/api/v2", {
  Accept: "application/json",
  "Cache-Control": "public, max-age=300",
});
