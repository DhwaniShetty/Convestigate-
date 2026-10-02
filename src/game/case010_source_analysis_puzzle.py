class Case010SourceAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "letter_claims_separated_from_facts": True,
            "letter_authenticity_questioned": True,
            "handwriting_provenance_considered": True,
            "ink_provenance_considered": True,
            "distribution_history_considered": True,
            "single_perpetrator_authorship_not_established": True,
            "press_influence_identified": True
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
    