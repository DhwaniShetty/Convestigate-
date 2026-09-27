class Case011SourceAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "letter_authorship_examined": True,
            "letter_provenance_examined": True,
            "attacker_letter_connection_tested": True,
            "letter_writer_identity_unestablished": True,
            "single_author_hypothesis_not_proven": True
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
    