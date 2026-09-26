class Case012DigitalForensicsPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "post_mortem_account_activity_identified": True,
            "post_mortem_phone_activity_identified": True,
            "activity_timing_examined": True,
            "activity_inconsistent_with_mike": True,
            "possible_third_party_access_identified": True
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
    