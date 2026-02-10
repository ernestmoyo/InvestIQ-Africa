"""Tests for API endpoints."""
import pytest


class TestHealthEndpoint:
    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_endpoint(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "InvestIQ" in data["name"]


class TestAnalyticsEndpoints:
    def test_dashboard_summary(self, client):
        response = client.get("/api/v1/analytics/dashboard-summary")
        assert response.status_code == 200
        data = response.json()
        assert "total_fdi_ytd" in data
        assert "active_investments" in data

    def test_sector_risk_return(self, client):
        response = client.get("/api/v1/analytics/sector-risk-return")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_sectors_list(self, client):
        response = client.get("/api/v1/analytics/sectors")
        assert response.status_code == 200

    def test_sez_list(self, client):
        response = client.get("/api/v1/analytics/sez")
        assert response.status_code == 200


class TestImpactEndpoints:
    def test_job_creation(self, client):
        response = client.post(
            "/api/v1/impact/job-creation",
            json={
                "investment_amount": 50000000,
                "sector": "mining",
                "province": "Mashonaland West",
                "is_sez": False,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "direct_jobs" in data
        assert "total_jobs" in data

    def test_gdp_contribution(self, client):
        response = client.post(
            "/api/v1/impact/gdp-contribution",
            json={
                "investment_amount": 50000000,
                "sector": "agriculture",
                "years": 10,
            },
        )
        assert response.status_code == 200

    def test_sector_benchmarks(self, client):
        response = client.get("/api/v1/impact/sector-benchmarks")
        assert response.status_code == 200


class TestMatchingEndpoints:
    def test_analyse_inquiry(self, client):
        response = client.post(
            "/api/v1/matching/analyse-inquiry",
            json={
                "inquiry_text": "We are a South African mining company interested in investing $50 million in lithium mining in Zimbabwe."
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "extracted_sectors" in data
        assert "inquiry_type" in data

    def test_investors_list(self, client):
        response = client.get("/api/v1/matching/investors")
        assert response.status_code == 200

    def test_opportunities_list(self, client):
        response = client.get("/api/v1/matching/opportunities")
        assert response.status_code == 200
