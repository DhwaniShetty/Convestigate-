class EmploymentPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data["unlocks"]

    def check_answer(self, answer):
        """
        P02 checks whether the player has verified
        Daniel Cross's employment history and transfer timing.
        """
        if not isinstance(answer, dict):
            return False

        employment_verified = answer.get("employment_verified", False)
        transfer_verified = answer.get("transfer_verified", False)

        return employment_verified and transfer_verified

    def get_unlocked_evidence(self):
        return self.unlocks