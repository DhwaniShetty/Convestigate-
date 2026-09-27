class Case004FinalReconstructionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "rhea_alibi_failed_independent_corroboration": True,
            "vikas_alibi_independently_corroborated": True,
            "neha_alibi_independently_corroborated": True,
            "phone_carry_explanation_identified": True,
            "rhea_identified_as_killer": True,
            "exact_return_route_unresolved": True
        }

        self.required_hypotheses = {
            "H1": "supported",
            "H2": "contradicted",
            "H3": "contradicted",
            "H4": "supported"
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

        hypotheses = answer.get("hypotheses")

        if not isinstance(hypotheses, dict):
            return False

        for key, expected_value in self.required_hypotheses.items():
            if hypotheses.get(key) != expected_value:
                return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks
    