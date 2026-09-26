class HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_hypotheses = [
            "voluntary_disappearance",
            "undiscovered_self_harm",
            "third_party_intervention"
        ]

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        hypotheses = answer.get("hypotheses", [])

        if not isinstance(hypotheses, list):
            return False

        return set(hypotheses) == set(self.required_hypotheses)

    def get_unlocked_evidence(self):
        return self.unlocks