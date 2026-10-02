class Case010ConclusionWritingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "established_facts_listed": True,
            "plausible_inferences_listed": True,
            "unresolved_questions_listed": True,
            "single_offender_requirements_identified": True,
            "single_offender_not_proven": True,
            "letter_authenticity_unresolved": True,
            "case_linkage_unresolved": True
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
    