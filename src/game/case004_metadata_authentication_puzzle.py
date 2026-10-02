class Case004MetadataAuthenticationPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "device_presence_distinguished": True,
            "rhea_device_alibi_questioned": True,
            "companion_phone_carry_identified": True,
            "retreat_gap_identified": True,
            "toll_footage_connection_identified": True,
            "person_presence_not_assumed": True
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
    