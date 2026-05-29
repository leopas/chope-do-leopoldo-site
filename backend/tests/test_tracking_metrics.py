def _post_event(client, **kwargs) -> None:
    client.post("/api/public/tracking-events", json=kwargs)


def test_campaign_metrics_aggregates(seeded_client) -> None:
    campaign_id = "c-karaoke"
    slug = "karaoke-sexta"

    _post_event(
        seeded_client,
        eventName="ViewCampaignLandingPage",
        campaignId=campaign_id,
        campaignSlug=slug,
        sessionId="s1",
    )
    _post_event(
        seeded_client,
        eventName="ViewCampaignLandingPage",
        campaignSlug=slug,
        sessionId="s2",
    )
    _post_event(
        seeded_client,
        eventName="ClickWhatsApp",
        campaignId=campaign_id,
        sessionId="s1",
    )
    _post_event(
        seeded_client,
        eventName="ClickDirections",
        campaignSlug=slug,
        sessionId="s1",
    )
    _post_event(
        seeded_client,
        eventName="CouponShown",
        campaignId=campaign_id,
        sessionId="s1",
    )
    _post_event(
        seeded_client,
        eventName="CouponCopied",
        campaignId=campaign_id,
        sessionId="s1",
    )

    response = seeded_client.get(f"/api/admin/campaigns/{campaign_id}/metrics")
    assert response.status_code == 200
    body = response.json()
    assert body["views"] == 2
    assert body["clickWhatsApp"] == 1
    assert body["clickDirections"] == 1
    assert body["couponsShown"] == 1
    assert body["couponsCopied"] == 1
    assert body["whatsappRate"] == 0.5
    assert body["directionsRate"] == 0.5


def test_hash_client_ip_never_stores_raw(seeded_client) -> None:
    from app.services.tracking_metrics import hash_client_ip

    raw = "203.0.113.10"
    hashed = hash_client_ip(raw, salt="chope-do-leopoldo-site")
    assert hashed
    assert hashed != raw
    assert len(hashed) == 32

    response = seeded_client.post(
        "/api/public/tracking-events",
        json={"eventName": "PageView", "sessionId": "sess-ip"},
        headers={"X-Forwarded-For": raw},
    )
    assert response.status_code == 201
