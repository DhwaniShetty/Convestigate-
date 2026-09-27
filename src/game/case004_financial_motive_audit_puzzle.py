class Case004FinancialMotiveAuditPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "equity_dispute_examined": True,
            "vikas_buyout_conflict_examined": True,
            "neha_termination_fallout_examined": True,
            "motives_compared_independently": True,
            "motive_not_treated_as_proof": True
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
    