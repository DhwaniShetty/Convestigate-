class Case003EvidenceClassificationPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "job_offer_observed": True,
            "genuine_job_offer_not_established": True,
            "family_packing_identified": True,
            "packing_does_not_prove_voluntary_disappearance": True,
            "jacket_logo_unverified": True,
            "unknown_man_description_incomplete": True
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