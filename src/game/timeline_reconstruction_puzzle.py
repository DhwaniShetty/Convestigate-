class TimelineReconstructionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_order = [
            "phase_1",
            "phase_2",
            "phase_3",
            "phase_4",
            "phase_5"
        ]

        self.required_alcohol_conclusion = (
            "alcohol_involvement_does_not_prove_why_ron_left_or_who_killed_him"
        )

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        order = answer.get("order", [])
        alcohol_conclusion = answer.get("alcohol_conclusion")

        if not isinstance(order, list):
            return False

        if not isinstance(alcohol_conclusion, str):
            return False

        return (
            order == self.required_order
            and alcohol_conclusion == self.required_alcohol_conclusion
        )

    def get_unlocked_evidence(self):
        return self.unlocks