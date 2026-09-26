class Case006EvidenceGenerationPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "ten_dollar_balance_explained": True,
            "withdrawal_interpretation_generated": True,
            "vehicle_inventory_checked": True,
            "minimal_clothing_identified": True,
            "missing_valuables_identified": True,
            "empty_car_contradiction_identified": True
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