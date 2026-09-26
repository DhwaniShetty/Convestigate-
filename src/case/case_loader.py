import json

from src.case.case import Case


def load_case(case_id):
    case_id = str(case_id).zfill(3)

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
        case_data["puzzles"]
    )


if __name__ == "__main__":
    case = load_case("014")

    print("CASE:", case.title)
    print("CASE_ID:", case.case_id)
    print("VICTIM:", case.victim["name"])
    print("SUSPECTS:", len(case.suspects))
    print("TIMELINE:", len(case.timeline))
    print("EVIDENCE:", len(case.evidence))