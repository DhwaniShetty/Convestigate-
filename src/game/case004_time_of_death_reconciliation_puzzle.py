class Case004TimeOfDeathReconciliationPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "time_of_death_window_identified": True,
            "rhea_alibi_window_tested": True,
            "vikas_alibi_window_tested": True,
            "neha_alibi_window_tested": True,
            "full_window_coverage_compared": True
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
    