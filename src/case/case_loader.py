import json

from src.case.case import Case


def load_case(case_id):
    case_id = str(case_id)

    if case_id.endswith(".json"):
        file_path = case_id
    else:
        case_id = case_id.zfill(3)
        file_path = f"data/case_{case_id}.json"

    with open(file_path, "r") as file:
        case_data = json.load(file)

    return Case(
        case_data["case_id"],
        case_data["title"],
        case_data["victim"],
        case_data["suspects"],
        case_data["timeline"],
        case_data["evidence"],
        case_data["puzzles"]
    )