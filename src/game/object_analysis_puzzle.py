class ObjectAnalysisPuzzle:
    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "matches_recorded_vehicle": False,
            "indicates_deliberate_route": True,
            "supports_confusion_explanation": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        matches_recorded_vehicle = answer.get("matches_recorded_vehicle")
        indicates_deliberate_route = answer.get("indicates_deliberate_route")
        supports_confusion_explanation = answer.get(
            "supports_confusion_explanation"
        )

        if not isinstance(matches_recorded_vehicle, bool):
            return False

        if not isinstance(indicates_deliberate_route, bool):
            return False

        if not isinstance(supports_confusion_explanation, bool):
            return False

        return (
            matches_recorded_vehicle
            == self.required_analysis["matches_recorded_vehicle"]
            and indicates_deliberate_route
            == self.required_analysis["indicates_deliberate_route"]
            and supports_confusion_explanation
            == self.required_analysis["supports_confusion_explanation"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks
    