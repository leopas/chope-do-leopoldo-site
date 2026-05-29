import type { Category } from "../types";
import chopesCover from "@/assets/product-chope.jpg";
import drinksCover from "@/assets/product-caipirinha.jpg";
import burgersCover from "@/assets/product-leopoldao.jpg";
import porcoesCover from "@/assets/product-fritas.jpg";
import bebidasCover from "@/assets/product-chope.jpg";
import eventosCover from "@/assets/campaign-karaoke.jpg";

export const mockCategories: Category[] = [
  {
    id: "cat-chopes",
    name: "Chopes",
    description: "Sempre gelado, na medida certa.",
    icon: "🍺",
    imageUrl: chopesCover,
    imageAlt: "Caneco de chope gelado",
    accentColor: "#d4a017",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "cat-drinks",
    name: "Drinks",
    description: "Clássicos e autorais do bar.",
    icon: "🍹",
    imageUrl: drinksCover,
    imageAlt: "Drink em copo alto",
    accentColor: "#7bb13b",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "cat-burgers",
    name: "Hambúrgueres",
    description: "Carne fresca, pão na chapa.",
    icon: "🍔",
    imageUrl: burgersCover,
    imageAlt: "Hambúrguer suculento",
    accentColor: "#b35a1a",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "cat-porcoes",
    name: "Porções",
    description: "Para dividir com a galera.",
    icon: "🍟",
    imageUrl: porcoesCover,
    imageAlt: "Porção de fritas",
    accentColor: "#d97706",
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "cat-bebidas",
    name: "Bebidas",
    description: "Refrigerantes, sucos e mais.",
    icon: "🥤",
    imageUrl: bebidasCover,
    imageAlt: "Bebida gelada",
    accentColor: "#0ea5e9",
    isActive: true,
    displayOrder: 5,
  },
  {
    id: "cat-eventos",
    name: "Eventos / Combos",
    description: "Karaokê, jogos e combos especiais.",
    icon: "🎤",
    imageUrl: eventosCover,
    imageAlt: "Microfone de karaokê",
    accentColor: "#a855f7",
    isActive: true,
    displayOrder: 6,
  },
];
