import json

from src.case.case import Case


def load_case(file_path="data/case_014.json"):
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