class ContradictoryPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.witnesses = puzzle_data.get("witnesses", [])
        self.unlocks = puzzle_data.get("unlocks", [])
        self.expected_identification = puzzle_data.get(
            "expected_player_identification",
            ""
        )

    def check_answer(self, answer):
        """
        Check whether the player correctly identifies
        the unreliable witness.
        """

        if not isinstance(answer, dict):
            return False

        unreliable_witness = answer.get("unreliable_witness")

        return unreliable_witness == "W02"

    def get_unlocked_evidence(self):
        return self.unlocks