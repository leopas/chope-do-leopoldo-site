import type { Campaign } from "../types";
import karaoke from "@/assets/campaign-karaoke.jpg";
import leopoldao from "@/assets/product-leopoldao.jpg";
import pilsen from "@/assets/campaign-pilsen.jpg";
import caneco from "@/assets/campaign-caneco.jpg";

export const mockCampaigns: Campaign[] = [
  {
    id: "c-karaoke",
    name: "Karaokê Sexta",
    slug: "karaoke-sexta",
    title: "Toda sexta é dia de soltar a voz",
    description:
      "Karaokê ao vivo a partir das 21h. Combo especial de chope + fritas pra cantar até a última música.",
    heroImageUrl: karaoke,
    heroImageAlt: "Microfone iluminado no palco",
    couponCode: "KARAOKESEXTA",
    channel: "instagram",
    status: "active",
    ctaLabel: "Garantir minha mesa",
  },
  {
    id: "c-leopoldao",
    name: "Leopoldão",
    slug: "leopoldao",
    title: "O burger que virou apelido da casa",
    description:
      "Duplo, com bacon, cheddar derretido e molho da casa. Acompanha fritas crocantes.",
    heroImageUrl: leopoldao,
    heroImageAlt: "Hambúrguer Leopoldão suculento",
    featuredProductImageUrl: leopoldao,
    couponCode: "LEOPOLDAO10",
    channel: "paid_traffic",
    status: "active",
    ctaLabel: "Quero o Leopoldão",
  },
  {
    id: "c-pilsen-dobro",
    name: "Pilsen em Dobro",
    slug: "pilsen-em-dobro",
    title: "Pilsen em dobro, toda quarta",
    description:
      "Peça uma Pilsen 500ml e leve outra. Promoção válida das 18h às 21h, somente às quartas.",
    heroImageUrl: pilsen,
    heroImageAlt: "Dois canecos de Pilsen brindando",
    couponCode: "PILSENEMDOBRO",
    channel: "qr_code",
    status: "active",
    ctaLabel: "Reservar mesa",
  },
  {
    id: "c-caneco-mundo",
    name: "Caneco do Mundo",
    slug: "caneco-do-mundo",
    title: "Jogos do Brasil são aqui",
    description:
      "Telão, caneco gelado e galera junto. Combos especiais nos dias de jogo.",
    heroImageUrl: caneco,
    heroImageAlt: "Caneco de chope ao lado de bola de futebol",
    couponCode: "BRASIL",
    channel: "organic",
    status: "active",
    ctaLabel: "Garantir lugar",
  },
];
