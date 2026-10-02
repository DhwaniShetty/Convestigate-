class FieldEvidenceAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        significance = answer.get("significance")
        limitation = answer.get("limitation")

        return (
            significance == "scent_trail_ends_near_roadway"
            and
            limitation == "does_not_prove_what_happened_to_bryce"
        )

    def get_unlocked_evidence(self):
        return self.unlocks