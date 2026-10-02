class Case002HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_statuses = {
            "H1": "contradicted",
            "H2": "supported",
            "H3": "unresolved",
            "H4": "supported",
            "H5": "contradicted",
            "H6": "supported"
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        for hypothesis_id, expected_status in self.required_statuses.items():

            actual_status = answer.get(hypothesis_id)

            if not isinstance(actual_status, str):
                return False

            if actual_status != expected_status:
                return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks