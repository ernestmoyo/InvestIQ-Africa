"""NLP processing for investment inquiry analysis."""
import re
from typing import List, Dict, Optional


class NLPProcessor:
    """Analyse investor inquiry text to extract intent, preferences, and concerns."""

    SECTOR_KEYWORDS = {
        "mining": ["mining", "mineral", "gold", "platinum", "lithium", "chrome", "diamond", "quarry", "ore"],
        "agriculture": ["agriculture", "farming", "agro", "tobacco", "horticulture", "livestock", "crop", "dairy", "maize"],
        "tourism": ["tourism", "hotel", "safari", "victoria falls", "hospitality", "lodge", "travel", "eco-tourism"],
        "manufacturing": ["manufacturing", "factory", "textile", "chemical", "food processing", "steel", "cement", "industrial"],
        "ict": ["ict", "technology", "software", "fintech", "digital", "telecom", "data center", "app", "internet"],
        "energy": ["energy", "solar", "hydro", "power", "electricity", "renewable", "wind", "biomass", "thermal"],
        "infrastructure": ["infrastructure", "construction", "road", "bridge", "housing", "water", "sanitation", "building"],
        "financial_services": ["bank", "insurance", "microfinance", "fintech", "capital market", "fund", "investment banking"],
        "health": ["health", "pharmaceutical", "hospital", "medicine", "medical", "clinic", "drug", "biotech"],
    }

    INVESTMENT_SIGNALS = {
        "ready_to_invest": ["ready to invest", "committed", "finalizing", "approved budget", "looking to deploy",
                           "seeking to invest", "prepared to", "wish to commit", "allocat"],
        "serious": ["interested in investing", "exploring opportunities", "considering", "evaluating",
                    "looking for", "seeking", "potential investment", "would like to"],
        "exploratory": ["curious", "learning about", "information", "general inquiry", "wondering",
                       "what opportunities", "tell me about", "overview"],
    }

    CONCERN_KEYWORDS = {
        "political_risk": ["political", "stability", "governance", "policy change", "regulation"],
        "currency_risk": ["currency", "exchange rate", "devaluation", "forex", "repatriation"],
        "infrastructure": ["infrastructure", "power supply", "electricity", "road", "logistics"],
        "legal": ["legal", "property rights", "land", "ownership", "contract enforcement"],
        "corruption": ["corruption", "transparency", "bribery"],
    }

    POSITIVE_WORDS = ["opportunity", "growth", "potential", "promising", "attractive", "favorable", "exciting", "confident", "optimistic"]
    NEGATIVE_WORDS = ["concern", "risk", "worried", "uncertain", "challenge", "difficult", "problem", "fear", "skeptical"]

    def extract_sectors(self, text: str) -> List[str]:
        text_lower = text.lower()
        found = []
        for sector, keywords in self.SECTOR_KEYWORDS.items():
            if any(kw in text_lower for kw in keywords):
                found.append(sector)
        return found if found else ["general"]

    def extract_investment_size(self, text: str) -> Optional[Dict]:
        patterns = [
            r'\$\s*(\d+(?:\.\d+)?)\s*(?:billion|bn|b)\b',
            r'\$\s*(\d+(?:\.\d+)?)\s*(?:million|mn|m)\b',
            r'(\d+(?:\.\d+)?)\s*(?:million|mn|m)\s*(?:usd|dollars?|\$)',
            r'(\d+(?:\.\d+)?)\s*(?:billion|bn|b)\s*(?:usd|dollars?|\$)',
            r'between\s*\$?\s*(\d+)\s*(?:and|to|-)\s*\$?\s*(\d+)\s*(million|billion|m|b)',
        ]
        text_lower = text.lower()
        for p in patterns[:2]:
            m = re.search(p, text_lower)
            if m:
                val = float(m.group(1))
                unit = "billion" if "billion" in p or "bn" in p or p.endswith("b\\b") else "million"
                multiplier = 1_000_000_000 if "billion" in p else 1_000_000
                return {"amount": val * multiplier, "display": f"${val}{unit[0].upper()}"}
        for p in patterns[2:4]:
            m = re.search(p, text_lower)
            if m:
                val = float(m.group(1))
                is_billion = "billion" in p or "bn" in p
                multiplier = 1_000_000_000 if is_billion else 1_000_000
                return {"amount": val * multiplier, "display": f"${val}{'B' if is_billion else 'M'}"}
        m = re.search(patterns[4], text_lower)
        if m:
            low, high = float(m.group(1)), float(m.group(2))
            is_billion = m.group(3).startswith("b")
            mult = 1_000_000_000 if is_billion else 1_000_000
            return {"min": low * mult, "max": high * mult, "display": f"${low}-${high}{'B' if is_billion else 'M'}"}
        return None

    def classify_inquiry_type(self, text: str) -> str:
        text_lower = text.lower()
        for itype in ["ready_to_invest", "serious", "exploratory"]:
            if any(signal in text_lower for signal in self.INVESTMENT_SIGNALS[itype]):
                return itype
        return "exploratory"

    def analyze_sentiment(self, text: str) -> Dict:
        text_lower = text.lower()
        pos = sum(1 for w in self.POSITIVE_WORDS if w in text_lower)
        neg = sum(1 for w in self.NEGATIVE_WORDS if w in text_lower)
        total = pos + neg
        if total == 0:
            return {"label": "neutral", "score": 0.5}
        score = pos / total
        label = "positive" if score > 0.6 else ("negative" if score < 0.4 else "neutral")
        return {"label": label, "score": round(score, 2)}

    def extract_concerns(self, text: str) -> List[str]:
        text_lower = text.lower()
        return [concern for concern, keywords in self.CONCERN_KEYWORDS.items()
                if any(kw in text_lower for kw in keywords)]

    def extract_key_entities(self, text: str) -> Dict:
        countries = []
        country_list = ["south africa", "china", "india", "uk", "united kingdom", "australia", "uae",
                       "dubai", "usa", "united states", "germany", "france", "japan", "kenya",
                       "netherlands", "brazil", "russia", "cyprus", "mauritius", "singapore"]
        text_lower = text.lower()
        for c in country_list:
            if c in text_lower:
                countries.append(c.title())
        return {"countries": countries, "sectors": self.extract_sectors(text)}

    def generate_suggested_response(self, inquiry_type: str, sectors: List[str], entities: Dict) -> str:
        sector_text = ", ".join(s.replace("_", " ").title() for s in sectors)
        if inquiry_type == "ready_to_invest":
            return (f"Thank you for your interest in investing in Zimbabwe's {sector_text} sector(s). "
                    f"We would be delighted to arrange a meeting with our Senior Investment Promotion Officer "
                    f"to discuss your investment plans in detail. Please let us know your preferred schedule.")
        elif inquiry_type == "serious":
            return (f"Thank you for considering Zimbabwe as an investment destination. "
                    f"The {sector_text} sector(s) offer significant opportunities. "
                    f"We will prepare a detailed investment brief and connect you with relevant stakeholders.")
        return (f"Thank you for your inquiry about investment opportunities in Zimbabwe. "
                f"We have prepared general information on the {sector_text} sector(s) for your review. "
                f"Please do not hesitate to contact us for more detailed information.")

    def _get_department(self, sectors: List[str], inquiry_type: str) -> str:
        dept_map = {
            "mining": "Mining & Natural Resources Division",
            "agriculture": "Agriculture & Agro-processing Division",
            "tourism": "Tourism & Hospitality Division",
            "manufacturing": "Manufacturing & Industrial Division",
            "ict": "ICT & Innovation Division",
            "energy": "Energy & Infrastructure Division",
            "infrastructure": "Energy & Infrastructure Division",
            "financial_services": "Financial Services Division",
            "health": "Health & Pharmaceuticals Division",
        }
        if sectors and sectors[0] in dept_map:
            return dept_map[sectors[0]]
        return "Investment Promotion Division"

    def full_analysis(self, text: str) -> Dict:
        sectors = self.extract_sectors(text)
        size = self.extract_investment_size(text)
        inquiry_type = self.classify_inquiry_type(text)
        sentiment = self.analyze_sentiment(text)
        concerns = self.extract_concerns(text)
        entities = self.extract_key_entities(text)
        department = self._get_department(sectors, inquiry_type)
        response = self.generate_suggested_response(inquiry_type, sectors, entities)
        return {
            "extracted_sectors": sectors,
            "investment_size_indicator": size.get("display") if size else None,
            "timeline": None,
            "concerns": concerns,
            "inquiry_type": inquiry_type,
            "sentiment": sentiment["label"],
            "recommended_department": department,
            "suggested_response": response,
            "entities": entities,
        }
