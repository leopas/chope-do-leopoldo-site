"""Dados iniciais idempotentes (espelham mocks do frontend)."""

from app.models.campaign import CampaignChannel, CampaignStatus
from app.models.media_asset import MediaAssetType, StorageProvider

SITE_SETTINGS_ID = "site-default"

CATEGORIES = [
    {
        "id": "cat-chopes",
        "name": "Chopes",
        "description": "Sempre gelado, na medida certa.",
        "icon": "🍺",
        "image_url": "/assets/product-chope.jpg",
        "image_alt": "Caneco de chope gelado",
        "accent_color": "#d4a017",
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "cat-drinks",
        "name": "Drinks",
        "description": "Clássicos e autorais do bar.",
        "icon": "🍹",
        "image_url": "/assets/product-caipirinha.jpg",
        "image_alt": "Drink em copo alto",
        "accent_color": "#7bb13b",
        "is_active": True,
        "display_order": 2,
    },
    {
        "id": "cat-burgers",
        "name": "Hambúrgueres",
        "description": "Carne fresca, pão na chapa.",
        "icon": "🍔",
        "image_url": "/assets/product-leopoldao.jpg",
        "image_alt": "Hambúrguer suculento",
        "accent_color": "#b35a1a",
        "is_active": True,
        "display_order": 3,
    },
    {
        "id": "cat-porcoes",
        "name": "Porções",
        "description": "Para dividir com a galera.",
        "icon": "🍟",
        "image_url": "/assets/product-fritas.jpg",
        "image_alt": "Porção de fritas",
        "accent_color": "#d97706",
        "is_active": True,
        "display_order": 4,
    },
    {
        "id": "cat-bebidas",
        "name": "Bebidas",
        "description": "Refrigerantes, sucos e mais.",
        "icon": "🥤",
        "image_url": "/assets/product-chope.jpg",
        "image_alt": "Bebida gelada",
        "accent_color": "#0ea5e9",
        "is_active": True,
        "display_order": 5,
    },
    {
        "id": "cat-eventos",
        "name": "Eventos / Combos",
        "description": "Karaokê, jogos e combos especiais.",
        "icon": "🎤",
        "image_url": "/assets/campaign-karaoke.jpg",
        "image_alt": "Microfone de karaokê",
        "accent_color": "#a855f7",
        "is_active": True,
        "display_order": 6,
    },
]

PRODUCTS = [
    {
        "id": "p-pilsen-500",
        "name": "Pilsen 500ml",
        "description": "Chope claro, leve e refrescante.",
        "price_cents": 1400,
        "category_id": "cat-chopes",
        "image_url": "/assets/product-chope.jpg",
        "image_alt": "Caneco de chope Pilsen 500ml",
        "is_alcoholic": True,
        "is_featured": True,
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "p-pilsen-300",
        "name": "Pilsen 300ml",
        "description": "Pra quem prefere o tulipa gelado.",
        "price_cents": 900,
        "category_id": "cat-chopes",
        "image_url": "/assets/product-chope.jpg",
        "image_alt": "Tulipa de chope Pilsen 300ml",
        "is_alcoholic": True,
        "is_featured": False,
        "is_active": True,
        "display_order": 2,
    },
    {
        "id": "p-leopoldao",
        "name": "Leopoldão",
        "description": "Burger duplo, bacon, cheddar e molho da casa.",
        "price_cents": 3800,
        "category_id": "cat-burgers",
        "image_url": "/assets/product-leopoldao.jpg",
        "image_alt": "Hambúrguer Leopoldão",
        "is_alcoholic": False,
        "is_featured": True,
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "p-coxinha",
        "name": "Coxinha da Mama",
        "description": "Porção com 8 coxinhas crocantes recheadas.",
        "price_cents": 2800,
        "category_id": "cat-porcoes",
        "image_url": "/assets/product-coxinha.jpg",
        "image_alt": "Porção de coxinhas",
        "is_alcoholic": False,
        "is_featured": True,
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "p-caipirinha",
        "name": "Caipirinha",
        "description": "Cachaça, limão fresco e açúcar. Clássico.",
        "price_cents": 1800,
        "category_id": "cat-drinks",
        "image_url": "/assets/product-caipirinha.jpg",
        "image_alt": "Caipirinha clássica",
        "is_alcoholic": True,
        "is_featured": False,
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "p-fritas",
        "name": "Porção de Fritas",
        "description": "Batatas crocantes com sal grosso.",
        "price_cents": 2400,
        "category_id": "cat-porcoes",
        "image_url": "/assets/product-fritas.jpg",
        "image_alt": "Porção generosa de batatas fritas",
        "is_alcoholic": False,
        "is_featured": False,
        "is_active": True,
        "display_order": 2,
    },
    {
        "id": "p-combo-karaoke",
        "name": "Combo Karaokê",
        "description": "2 chopes 500ml + porção de fritas. Só nas sextas.",
        "price_cents": 4990,
        "category_id": "cat-eventos",
        "image_url": "/assets/campaign-karaoke.jpg",
        "image_alt": "Combo karaokê com chopes e fritas",
        "is_alcoholic": True,
        "is_featured": True,
        "is_active": True,
        "display_order": 1,
    },
    {
        "id": "p-refri",
        "name": "Refrigerante Lata",
        "description": "Coca, Guaraná, Soda. Sempre gelado.",
        "price_cents": 700,
        "category_id": "cat-bebidas",
        "image_url": "/assets/product-chope.jpg",
        "image_alt": "Refrigerante em lata",
        "is_alcoholic": False,
        "is_featured": False,
        "is_active": True,
        "display_order": 1,
    },
]

CAMPAIGNS = [
    {
        "id": "c-karaoke",
        "name": "Karaokê Sexta",
        "slug": "karaoke-sexta",
        "title": "Toda sexta é dia de soltar a voz",
        "description": (
            "Karaokê ao vivo a partir das 21h. Combo especial de chope + fritas "
            "pra cantar até a última música."
        ),
        "hero_image_url": "/assets/campaign-karaoke.jpg",
        "hero_image_alt": "Microfone iluminado no palco",
        "coupon_code": "KARAOKESEXTA",
        "channel": CampaignChannel.instagram,
        "status": CampaignStatus.active,
        "cta_label": "Garantir minha mesa",
    },
    {
        "id": "c-leopoldao",
        "name": "Leopoldão",
        "slug": "leopoldao",
        "title": "O burger que virou apelido da casa",
        "description": (
            "Duplo, com bacon, cheddar derretido e molho da casa. "
            "Acompanha fritas crocantes."
        ),
        "hero_image_url": "/assets/product-leopoldao.jpg",
        "hero_image_alt": "Hambúrguer Leopoldão suculento",
        "coupon_code": "LEOPOLDAO10",
        "channel": CampaignChannel.paid_traffic,
        "status": CampaignStatus.active,
        "cta_label": "Quero o Leopoldão",
    },
    {
        "id": "c-pilsen-dobro",
        "name": "Pilsen em Dobro",
        "slug": "pilsen-em-dobro",
        "title": "Pilsen em dobro, toda quarta",
        "description": (
            "Peça uma Pilsen 500ml e leve outra. Promoção válida das 18h às 21h, "
            "somente às quartas."
        ),
        "hero_image_url": "/assets/campaign-pilsen.jpg",
        "hero_image_alt": "Dois canecos de Pilsen brindando",
        "coupon_code": "PILSENEMDOBRO",
        "channel": CampaignChannel.qr_code,
        "status": CampaignStatus.active,
        "cta_label": "Reservar mesa",
    },
    {
        "id": "c-caneco-mundo",
        "name": "Caneco do Mundo",
        "slug": "caneco-do-mundo",
        "title": "Jogos do Brasil são aqui",
        "description": (
            "Telão, caneco gelado e galera junto. Combos especiais nos dias de jogo."
        ),
        "hero_image_url": "/assets/campaign-caneco.jpg",
        "hero_image_alt": "Caneco de chope ao lado de bola de futebol",
        "coupon_code": "BRASIL",
        "channel": CampaignChannel.organic,
        "status": CampaignStatus.active,
        "cta_label": "Garantir lugar",
    },
]

MEDIA_ASSETS = [
    ("m-1", "chope-pilsen.jpg", "/assets/product-chope.jpg", "Caneco de chope", MediaAssetType.product),
    ("m-2", "leopoldao.jpg", "/assets/product-leopoldao.jpg", "Hambúrguer Leopoldão", MediaAssetType.product),
    ("m-3", "coxinha-da-mama.jpg", "/assets/product-coxinha.jpg", "Coxinhas crocantes", MediaAssetType.product),
    ("m-4", "caipirinha.jpg", "/assets/product-caipirinha.jpg", "Caipirinha", MediaAssetType.product),
    ("m-5", "porcao-fritas.jpg", "/assets/product-fritas.jpg", "Porção de fritas", MediaAssetType.product),
    ("m-6", "hero-bar.jpg", "/assets/hero-bar.jpg", "Atmosfera do bar", MediaAssetType.home),
    ("m-7", "campanha-karaoke.jpg", "/assets/campaign-karaoke.jpg", "Karaokê", MediaAssetType.campaign),
    ("m-8", "campanha-pilsen.jpg", "/assets/campaign-pilsen.jpg", "Pilsen em dobro", MediaAssetType.campaign),
    ("m-9", "campanha-caneco.jpg", "/assets/campaign-caneco.jpg", "Caneco do mundo", MediaAssetType.campaign),
]

SITE_SETTINGS = {
    "id": SITE_SETTINGS_ID,
    "business_name": "Chope do Leopoldo",
    "whatsapp_number": "5511999999999",
    "whatsapp_display": "(11) 99999-9999",
    "instagram_handle": "@chopedoleopoldo",
    "address": "Rua Coronel Ramos, 51 — Centro, Santa Isabel/SP",
    "maps_url": (
        "https://www.google.com/maps/search/?api=1&query="
        "Rua+Coronel+Ramos+51+Santa+Isabel+SP"
    ),
    "opening_hours": "Ter a Dom · 17h às 00h",
    "home_intro": (
        "Chopes, porções, hambúrgueres, drinks e eventos especiais "
        "no coração de Santa Isabel."
    ),
    "show_responsible_drinking_notice": True,
    "meta_pixel_id": "",
    "google_tag_manager_id": "",
    "load_marketing_scripts_after_consent": True,
}
