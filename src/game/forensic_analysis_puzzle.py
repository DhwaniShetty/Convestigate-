class ForensicAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        establishes = answer.get("establishes")
        does_not_establish = answer.get("does_not_establish")

        return (
            establishes == "crash_mechanics"
            and
            does_not_establish == "what_happened_to_bryce_afterward"
        )

    def get_unlocked_evidence(self):
        return self.unlocks