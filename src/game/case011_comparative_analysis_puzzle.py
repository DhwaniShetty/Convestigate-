class Case011ComparativeAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "attack_1_compared": True,
            "attack_2_compared": True,
            "attack_3_compared": True,
            "attack_4_compared": True,
            "weapon_patterns_compared": True,
            "victim_patterns_compared": True,
            "single_perpetrator_not_assumed": True
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
    