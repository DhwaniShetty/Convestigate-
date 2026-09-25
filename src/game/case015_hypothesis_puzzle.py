class Case015HypothesisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "sequence_is_not_causation": True,
            "letter_writer_distinct_from_killer": True,
            "trap_setter_distinct_from_letter_writer": True,
            "killer_identity_unresolved": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        for key in self.required_analysis:
            if not isinstance(answer.get(key), bool):
                return False

        return all(
            answer[key] == value
            for key, value in self.required_analysis.items()
        )

    def get_unlocked_evidence(self):
        return self.unlocks