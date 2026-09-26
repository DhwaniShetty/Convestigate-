class Case010ComparativeAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "case_a_compared": True,
            "case_b_compared": True,
            "case_c_compared": True,
            "case_d_compared": True,
            "case_e_compared": True,
            "locations_dates_circumstances_compared": True,
            "victim_pattern_documented": True
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
    