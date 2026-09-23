class ConnectionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data["unlocks"]

    def check_answer(self, answer):
        return answer == "confirmed"

    def get_unlocked_evidence(self):
        return self.unlocks