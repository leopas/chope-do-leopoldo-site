from tests.conftest import TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD


def test_admin_routes_require_auth(seeded_client) -> None:
    response = seeded_client.get("/api/admin/products")
    assert response.status_code == 401


def test_admin_login_and_me(seeded_client, admin_headers) -> None:
    me = seeded_client.get("/api/admin/auth/me", headers=admin_headers)
    assert me.status_code == 200
    assert me.json()["email"] == TEST_ADMIN_EMAIL


def test_admin_login_invalid_password(seeded_client) -> None:
    response = seeded_client.post(
        "/api/admin/auth/login",
        json={"email": TEST_ADMIN_EMAIL, "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_admin_logout(seeded_client, admin_headers) -> None:
    response = seeded_client.post("/api/admin/auth/logout", headers=admin_headers)
    assert response.status_code == 204


def test_public_api_stays_open_without_token(seeded_client) -> None:
    response = seeded_client.get("/api/public/menu")
    assert response.status_code == 200
