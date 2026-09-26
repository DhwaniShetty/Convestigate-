class Case012FactListingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "client_claims_listed": True,
            "confirmed_facts_separated": True,
            "communication_records_connected": True,
            "phone_connections_considered": True,
            "meeting_connections_considered": True,
            "steven_identity_not_assumed": True
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
    