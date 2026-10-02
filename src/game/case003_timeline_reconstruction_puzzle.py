class Case003TimelineReconstructionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "pub_encounter_identified": True,
            "unknown_man_left_with_ronnie": True,
            "job_call_identified": True,
            "unknown_man_inside_home": True,
            "residence_call_identified": True,
            "family_disappearance_identified": True
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