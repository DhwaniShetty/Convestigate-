class Case013HypothesisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "private_life_is_not_proof_of_murder": True,
            "weapon_and_radio_are_separate_evidence": True,
            "secrecy_and_responsibility_are_separate": True,
            "killer_identity_unresolved": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        for key in self.required_analysis:

            if not isinstance(answer.get(key), bool):
                return False

        return all(
            answer[key] == value
            for key, value in self.required_analysis.items()
        )

    def get_unlocked_evidence(self):
        return self.unlocks