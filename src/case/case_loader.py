import json

from src.case.case import Case
with open("data/case_014.json", "r") as file:
    case_data=json.load(file)

case =Case(
    case_data["case_id"], 
    case_data["title"],
    case_data["victim"],
    case_data["suspects"],
    case_data["timeline"],
    case_data["evidence"],
    case_data["puzzles"])


print("CASE:", case.title)
print("CASE_ID:",case.case_id)
print("VICTIM:", case.victim["name"])
print("SUSPECTS:", len(case.suspects))
print("TIMELINE:", len(case.timeline))
print("EVIDENCE:", len(case.evidence))