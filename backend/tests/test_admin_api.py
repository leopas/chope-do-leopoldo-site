def test_admin_product_crud_and_public_visibility(seeded_client) -> None:
    create = seeded_client.post(
        "/api/admin/products",
        json={
            "name": "Produto Teste API",
            "description": "Teste CRP-005",
            "price": 21.5,
            "categoryId": "cat-chopes",
            "imageUrl": "/assets/product-chope.jpg",
            "imageAlt": "Teste",
            "isActive": True,
            "displayOrder": 50,
        },
    )
    assert create.status_code == 201
    product = create.json()
    product_id = product["id"]
    assert product["price"] == 21.5

    public_before = seeded_client.get("/api/public/products").json()
    assert any(p["id"] == product_id for p in public_before)

    seeded_client.put(
        f"/api/admin/products/{product_id}",
        json={"isActive": False},
    )
    public_after = seeded_client.get("/api/public/products").json()
    assert not any(p["id"] == product_id for p in public_after)

    seeded_client.delete(f"/api/admin/products/{product_id}")


def test_admin_campaign_slug_404(seeded_client) -> None:
    response = seeded_client.get("/api/admin/campaigns/c-inexistente")
    assert response.status_code == 404


def test_admin_settings_update_reflects_public(seeded_client) -> None:
    seeded_client.put(
        "/api/admin/settings",
        json={"whatsappDisplay": "(11) 88888-8888"},
    )
    settings = seeded_client.get("/api/public/settings").json()
    assert settings["whatsappDisplay"] == "(11) 88888-8888"


def test_admin_category_create(seeded_client) -> None:
    response = seeded_client.post(
        "/api/admin/categories",
        json={
            "name": "Categoria Teste",
            "isActive": True,
            "displayOrder": 99,
        },
    )
    assert response.status_code == 201
    cat_id = response.json()["id"]
    seeded_client.delete(f"/api/admin/categories/{cat_id}")
