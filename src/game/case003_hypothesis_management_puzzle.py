class Case003HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_statuses = {
            "H1": "unresolved",
            "H2": "unresolved",
            "H3": "unresolved",
            "H4": "unresolved",
            "H5": "unresolved",
            "H6": "unresolved"
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        hypotheses = answer.get("hypotheses")

        if not isinstance(hypotheses, dict):
            return False

        for hypothesis_id, expected_status in self.required_statuses.items():

            actual_status = hypotheses.get(hypothesis_id)

            if actual_status != expected_status:
                return False

        if answer.get("final_conclusion") != "insufficient_evidence":
            return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks