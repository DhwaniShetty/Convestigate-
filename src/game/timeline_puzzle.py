class TimelinePuzzle:

    def __init__(self, timeline, evidence, puzzle_data):
        self.timeline = timeline
        self.evidence = evidence
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data["unlocks"]

    def check_answer(self, player_order):
        correct_order = [event["time"] for event in self.timeline]
        return player_order == correct_order

    def get_unlocked_evidence(self):
        return self.unlocks