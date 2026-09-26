class Case005EvidentiaryStandardPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "profile_x_not_authenticated": True,
            "profile_y_authenticated": True,
            "authentication_gap_identified": True,
            "repeated_reports_not_equivalent_to_authentication": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        for key, expected_value in self.required_analysis.items():

            actual_value = answer.get(key)

            if not isinstance(actual_value, bool):
                return False

            if actual_value != expected_value:
                return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks