import pytest

@pytest.mark.asyncio
async def test_root_endpoint(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data
    assert "api_v1" in data

@pytest.mark.asyncio
async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True
    assert "services" in data
    assert data["services"]["auth_service"] == "online"
    assert data["services"]["consultation_service"] == "online"

@pytest.mark.asyncio
async def test_liveness_and_readiness_probes(client):
    res_live = await client.get("/health/live")
    assert res_live.status_code == 200
    assert res_live.json()["status"] == "alive"

    res_ready = await client.get("/health/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "ready"

@pytest.mark.asyncio
async def test_correlation_id_middleware(client):
    custom_corr_id = "test-corr-id-982103"
    response = await client.get("/health", headers={"X-Correlation-ID": custom_corr_id})
    assert response.status_code == 200
    assert response.headers.get("X-Correlation-ID") == custom_corr_id
    assert "X-Response-Time-Ms" in response.headers

