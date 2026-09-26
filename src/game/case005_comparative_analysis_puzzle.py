class Case005ComparativeAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "profile_x_repeated": True,
            "profile_x_questioned": True,
            "profile_y_competing": True,
            "profile_y_authenticated": True,
            "profile_conflict_identified": True,
            "repetition_does_not_prove_authenticity": True
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