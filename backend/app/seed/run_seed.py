"""Database seeder for Zimbabwe reference data."""
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import engine, SessionLocal, Base
from app.models.sector import Sector
from app.models.investment import Investment, SpecialEconomicZone
from app.models.indicator import MacroeconomicIndicator
from app.models.investor import InvestorProfile, InvestmentOpportunity
from app.models.user import User
from app.seed.zimbabwe_sectors import SECTORS_DATA
from app.seed.sez_data import SEZ_DATA
from app.seed.macroeconomic_data import MACRO_INDICATORS
from app.seed.sample_investments import SAMPLE_INVESTMENTS, SAMPLE_INVESTORS, SAMPLE_OPPORTUNITIES


def seed_all():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Seed Sectors
        existing = db.query(Sector).count()
        if existing == 0:
            print("Seeding sectors...")
            for s in SECTORS_DATA:
                db.add(Sector(**s))
            db.flush()
            print(f"  Added {len(SECTORS_DATA)} sectors")
        else:
            print(f"  Sectors already seeded ({existing} found)")

        # Seed SEZs
        existing = db.query(SpecialEconomicZone).count()
        if existing == 0:
            print("Seeding Special Economic Zones...")
            for s in SEZ_DATA:
                db.add(SpecialEconomicZone(**s))
            db.flush()
            print(f"  Added {len(SEZ_DATA)} SEZs")
        else:
            print(f"  SEZs already seeded ({existing} found)")

        # Seed Macro Indicators
        existing = db.query(MacroeconomicIndicator).count()
        if existing == 0:
            print("Seeding macroeconomic indicators...")
            for m in MACRO_INDICATORS:
                db.add(MacroeconomicIndicator(
                    indicator_name=m["indicator_name"],
                    value=m["value"],
                    period=datetime.strptime(m["period"], "%Y-%m-%d").date(),
                    source=m["source"],
                    unit=m["unit"],
                ))
            db.flush()
            print(f"  Added {len(MACRO_INDICATORS)} indicators")
        else:
            print(f"  Indicators already seeded ({existing} found)")

        # Build sector code -> id map
        sectors = {s.code: s.id for s in db.query(Sector).all()}
        sez_map = {s.name: s.id for s in db.query(SpecialEconomicZone).all()}

        # Seed Investments
        existing = db.query(Investment).count()
        if existing == 0:
            print("Seeding sample investments...")
            for inv in SAMPLE_INVESTMENTS:
                data = {k: v for k, v in inv.items() if k != "sector_code"}
                data["sector_id"] = sectors.get(inv["sector_code"])
                if "date_received" in data:
                    data["date_received"] = datetime.strptime(data["date_received"], "%Y-%m-%d").date()
                db.add(Investment(**data))
            db.flush()
            print(f"  Added {len(SAMPLE_INVESTMENTS)} investments")
        else:
            print(f"  Investments already seeded ({existing} found)")

        # Seed Investor Profiles
        existing = db.query(InvestorProfile).count()
        if existing == 0:
            print("Seeding investor profiles...")
            for inv in SAMPLE_INVESTORS:
                db.add(InvestorProfile(**inv))
            db.flush()
            print(f"  Added {len(SAMPLE_INVESTORS)} investor profiles")
        else:
            print(f"  Investors already seeded ({existing} found)")

        # Seed Opportunities
        existing = db.query(InvestmentOpportunity).count()
        if existing == 0:
            print("Seeding investment opportunities...")
            for opp in SAMPLE_OPPORTUNITIES:
                data = {k: v for k, v in opp.items() if k != "sector_code"}
                data["sector_id"] = sectors.get(opp["sector_code"])
                db.add(InvestmentOpportunity(**data))
            db.flush()
            print(f"  Added {len(SAMPLE_OPPORTUNITIES)} opportunities")
        else:
            print(f"  Opportunities already seeded ({existing} found)")

        db.commit()
        print("\nSeeding complete!")

    except Exception as e:
        db.rollback()
        print(f"\nError during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
