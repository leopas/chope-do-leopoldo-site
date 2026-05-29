def test_public_menu_happy_path(seeded_client) -> None:
    response = seeded_client.get("/api/public/menu")
    assert response.status_code == 200
    body = response.json()

    assert body["settings"]["businessName"] == "Chope do Leopoldo"
    assert len(body["categories"]) == 6
    assert len(body["products"]) >= 1
    assert len(body["campaigns"]) == 4
    pilsen = next(p for p in body["products"] if p["id"] == "p-pilsen-500")
    assert pilsen["price"] == 14.0

    featured = body["featuredProducts"]
    assert len(featured) >= 1
    assert all(p["isFeatured"] for p in featured)


def test_public_products_only_active(seeded_client) -> None:
    response = seeded_client.get("/api/public/products")
    assert response.status_code == 200
    products = response.json()
    assert all(p["isActive"] for p in products)
    assert products[0]["displayOrder"] >= 1


def test_public_campaign_by_slug(seeded_client) -> None:
    response = seeded_client.get("/api/public/campaigns/karaoke-sexta")
    assert response.status_code == 200
    body = response.json()
    assert body["slug"] == "karaoke-sexta"
    assert body["status"] == "active"


def test_public_campaign_not_found(seeded_client) -> None:
    response = seeded_client.get("/api/public/campaigns/inexistente")
    assert response.status_code == 404
    assert response.json()["detail"]["message"] == "Campanha não encontrada"


def test_public_tracking_event(seeded_client) -> None:
    response = seeded_client.post(
        "/api/public/tracking-events",
        json={
            "eventName": "ViewMenu",
            "sessionId": "sess-1",
            "anonymousId": "anon-1",
            "utmSource": "instagram",
            "utmMedium": "social",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "accepted"
    assert body["id"]


def test_public_api_requires_database() -> None:
    from app.main import app

    client = __import__("fastapi.testclient", fromlist=["TestClient"]).TestClient(app)
    response = client.get("/api/public/menu")
    assert response.status_code == 503
