"""Impact calculator endpoints."""
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict
from sqlalchemy.orm import Session
import io

from app.database import get_db
from app.services.impact_calculator import InvestmentImpactCalculator
from app.services.report_generator import ReportGenerator

router = APIRouter(prefix="/impact", tags=["Impact Calculator"])


class JobCreationRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sector: str
    province: str = "Harare"
    is_sez: bool = False


class GDPRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sector: str
    years: int = 10


class MonteCarloRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sector: str
    num_simulations: int = 10000
    scenario: str = "base"


class SEZRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sez_id: str
    sector: str
    years: int = 10


class ROIRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sector: str
    revenue_assumptions: Optional[Dict] = None


class ComprehensiveRequest(BaseModel):
    investment_amount: float = Field(gt=0)
    sector: str
    province: str = "Harare"
    is_sez: bool = False
    sez_id: Optional[str] = None


@router.post("/job-creation")
def calculate_job_creation(request: JobCreationRequest, db: Session = Depends(get_db)):
    """Calculate job creation impact of an investment."""
    calc = InvestmentImpactCalculator(db)
    return calc.calculate_job_creation(request.investment_amount, request.sector, request.province, request.is_sez)


@router.post("/gdp-contribution")
def calculate_gdp(request: GDPRequest, db: Session = Depends(get_db)):
    """Calculate GDP contribution of an investment."""
    calc = InvestmentImpactCalculator(db)
    return calc.calculate_gdp_contribution(request.investment_amount, request.sector, request.years)


@router.post("/monte-carlo")
def run_monte_carlo(request: MonteCarloRequest, db: Session = Depends(get_db)):
    """Run Monte Carlo simulation for probabilistic impact."""
    calc = InvestmentImpactCalculator(db)
    result = calc.run_monte_carlo_simulation(request.investment_amount, request.sector, request.num_simulations, request.scenario)
    return {"statistics": result.get("statistics", {}), "outcome_count": len(result.get("outcomes", []))}


@router.post("/sez-incentives")
def calculate_sez(request: SEZRequest, db: Session = Depends(get_db)):
    """Calculate SEZ incentive impact."""
    calc = InvestmentImpactCalculator(db)
    return calc.calculate_sez_incentive_impact(request.investment_amount, request.sez_id, request.sector, request.years)


@router.post("/roi-timeline")
def generate_roi(request: ROIRequest, db: Session = Depends(get_db)):
    """Generate ROI timeline with breakeven analysis."""
    calc = InvestmentImpactCalculator(db)
    return calc.generate_roi_timeline(request.investment_amount, request.sector, request.revenue_assumptions)


@router.post("/comprehensive-report")
def comprehensive_report(request: ComprehensiveRequest, db: Session = Depends(get_db)):
    """Generate comprehensive impact assessment."""
    calc = InvestmentImpactCalculator(db)
    return calc.generate_comprehensive_report(
        request.investment_amount, request.sector, request.province, request.is_sez, request.sez_id)


@router.get("/sector-benchmarks")
def sector_benchmarks(db: Session = Depends(get_db)):
    """Get sector benchmark data."""
    calc = InvestmentImpactCalculator(db)
    return calc.get_sector_benchmarks()


@router.post("/export/pdf")
def export_pdf(request: ComprehensiveRequest, db: Session = Depends(get_db)):
    """Export impact report as PDF."""
    calc = InvestmentImpactCalculator(db)
    data = calc.generate_comprehensive_report(request.investment_amount, request.sector, request.province)
    gen = ReportGenerator()
    pdf_bytes = gen.generate_impact_pdf(data)
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf",
                           headers={"Content-Disposition": "attachment; filename=impact_report.pdf"})


@router.post("/export/excel")
def export_excel(request: ComprehensiveRequest, db: Session = Depends(get_db)):
    """Export impact report as Excel."""
    calc = InvestmentImpactCalculator(db)
    data = calc.generate_comprehensive_report(request.investment_amount, request.sector, request.province)
    gen = ReportGenerator()
    excel_bytes = gen.generate_impact_excel(data)
    return StreamingResponse(io.BytesIO(excel_bytes),
                           media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                           headers={"Content-Disposition": "attachment; filename=impact_report.xlsx"})
