"""Data ingestion service for bulk imports and validation."""
from typing import Dict, List, Tuple
from sqlalchemy.orm import Session
from app.models.investment import Investment


class DataIngestionService:
    REQUIRED_FIELDS = ["project_name", "investment_amount_usd"]
    VALID_STATUSES = {"inquiry", "approved", "active", "completed", "withdrawn"}

    def __init__(self, db: Session):
        self.db = db

    def validate_investment_data(self, data: Dict) -> Tuple[bool, List[str]]:
        errors = []
        for field in self.REQUIRED_FIELDS:
            if field not in data or not data[field]:
                errors.append(f"Missing required field: {field}")
        if "investment_amount_usd" in data:
            try:
                amount = float(data["investment_amount_usd"])
                if amount <= 0:
                    errors.append("investment_amount_usd must be positive")
            except (ValueError, TypeError):
                errors.append("investment_amount_usd must be a number")
        if "status" in data and data["status"] not in self.VALID_STATUSES:
            errors.append(f"Invalid status. Must be one of: {self.VALID_STATUSES}")
        return len(errors) == 0, errors

    def ingest_investment_record(self, data: Dict) -> Dict:
        valid, errors = self.validate_investment_data(data)
        if not valid:
            return {"success": False, "errors": errors}
        investment = Investment(**data)
        self.db.add(investment)
        self.db.commit()
        self.db.refresh(investment)
        return {"success": True, "id": str(investment.id)}

    def bulk_import_investments(self, records: List[Dict]) -> Dict:
        results = {"imported": 0, "failed": 0, "errors": []}
        for i, record in enumerate(records):
            valid, errors = self.validate_investment_data(record)
            if valid:
                self.db.add(Investment(**record))
                results["imported"] += 1
            else:
                results["failed"] += 1
                results["errors"].append({"row": i, "errors": errors})
        self.db.commit()
        return results
