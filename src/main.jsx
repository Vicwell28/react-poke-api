import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import App from "./App.jsx";
import NotFound from "@pages/NotFound";
import PokemonDetailPage from "@pages/PokemonDetailPage";
import PokemonPage from "@pages/PokemonPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokemon" element={<PokemonPage />} />
        <Route path="/pokemon/:pokemonName" element={<PokemonDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
