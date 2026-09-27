class Case001TimelineMaintenancePuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "timeline_sequence_correct": True,
            "repair_inconsistency_identified": True,
            "simple_accident_explanation_supported": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        timeline_sequence_correct = answer.get(
            "timeline_sequence_correct"
        )
        repair_inconsistency_identified = answer.get(
            "repair_inconsistency_identified"
        )
        simple_accident_explanation_supported = answer.get(
            "simple_accident_explanation_supported"
        )

        if not isinstance(timeline_sequence_correct, bool):
            return False

        if not isinstance(repair_inconsistency_identified, bool):
            return False

        if not isinstance(simple_accident_explanation_supported, bool):
            return False

        return (
            timeline_sequence_correct
            == self.required_analysis["timeline_sequence_correct"]
            and repair_inconsistency_identified
            == self.required_analysis["repair_inconsistency_identified"]
            and simple_accident_explanation_supported
            == self.required_analysis[
                "simple_accident_explanation_supported"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks