import json

from src.case.case import Case


def load_case(case_id="014"):
    case_id = str(case_id)

    if case_id.endswith(".json"):
        file_path = case_id
    else:
        case_id = case_id.zfill(3)
        file_path = f"data/case_{case_id}.json"

    with open(file_path, "r", encoding="utf-8") as file:
        case_data = json.load(file)

    return Case(
        case_data["case_id"],
        case_data["title"],
        case_data["victim"],
        case_data["suspects"],
        case_data["timeline"],
        case_data["evidence"],
        case_data["puzzles"],
        hypotheses=case_data.get("hypotheses", []),
        related_persons=case_data.get("related_persons", []),
        metadata={k: v for k, v in case_data.items() if k not in {
            "case_id", "title", "victim", "suspects", "timeline", "evidence", "puzzles", "hypotheses"
        }}
    )