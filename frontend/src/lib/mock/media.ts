import type { MediaAsset } from "../types";
import chope from "@/assets/product-chope.jpg";
import leopoldao from "@/assets/product-leopoldao.jpg";
import coxinha from "@/assets/product-coxinha.jpg";
import caipirinha from "@/assets/product-caipirinha.jpg";
import fritas from "@/assets/product-fritas.jpg";
import hero from "@/assets/hero-bar.jpg";
import karaoke from "@/assets/campaign-karaoke.jpg";
import pilsen from "@/assets/campaign-pilsen.jpg";
import caneco from "@/assets/campaign-caneco.jpg";

export const mockMedia: MediaAsset[] = [
  { id: "m-1", name: "chope-pilsen.jpg", url: chope, alt: "Caneco de chope", type: "product", uploadedAt: "2025-05-10" },
  { id: "m-2", name: "leopoldao.jpg", url: leopoldao, alt: "Hambúrguer Leopoldão", type: "product", uploadedAt: "2025-05-12" },
  { id: "m-3", name: "coxinha-da-mama.jpg", url: coxinha, alt: "Coxinhas crocantes", type: "product", uploadedAt: "2025-05-15" },
  { id: "m-4", name: "caipirinha.jpg", url: caipirinha, alt: "Caipirinha", type: "product", uploadedAt: "2025-05-18" },
  { id: "m-5", name: "porcao-fritas.jpg", url: fritas, alt: "Porção de fritas", type: "product", uploadedAt: "2025-05-20" },
  { id: "m-6", name: "hero-bar.jpg", url: hero, alt: "Atmosfera do bar", type: "home", uploadedAt: "2025-04-22" },
  { id: "m-7", name: "campanha-karaoke.jpg", url: karaoke, alt: "Karaokê", type: "campaign", uploadedAt: "2025-05-01" },
  { id: "m-8", name: "campanha-pilsen.jpg", url: pilsen, alt: "Pilsen em dobro", type: "campaign", uploadedAt: "2025-05-02" },
  { id: "m-9", name: "campanha-caneco.jpg", url: caneco, alt: "Caneco do mundo", type: "campaign", uploadedAt: "2025-05-03" },
];
