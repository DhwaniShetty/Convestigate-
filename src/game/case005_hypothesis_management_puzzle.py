class Case005HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_hypotheses = {
            "H1": "contradicted",
            "H2": "unresolved",
            "H3": "unresolved",
            "H4": "supported"
        }

        self.required_conclusion = "profile_y_authenticated"

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        hypotheses = answer.get("hypotheses")

        if not isinstance(hypotheses, dict):
            return False

        for hypothesis_id, expected_status in self.required_hypotheses.items():

            actual_status = hypotheses.get(hypothesis_id)

            if actual_status != expected_status:
                return False

        final_conclusion = answer.get("final_conclusion")

        if final_conclusion != self.required_conclusion:
            return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks