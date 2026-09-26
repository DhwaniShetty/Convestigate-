class Case010HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_hypotheses = {
            "H1": "unresolved",
            "H2": "unresolved",
            "H3": "supported",
            "H4": "supported"
        }

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

        return True

    def get_unlocked_evidence(self):
        return self.unlocks
    