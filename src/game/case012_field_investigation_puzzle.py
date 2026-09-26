class Case012FieldInvestigationPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "isolated_property_identified": True,
            "final_job_location_traced": True,
            "property_records_examined": True,
            "booking_history_examined": True,
            "steven_property_connection_identified": True
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
    