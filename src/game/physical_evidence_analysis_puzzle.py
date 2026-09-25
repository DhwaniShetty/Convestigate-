class PhysicalEvidenceAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "trap_is_separate_evidence": True,
            "frame_up_indicated": True,
            "letter_writer_equals_killer": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        trap_is_separate = answer.get("trap_is_separate_evidence")
        frame_up = answer.get("frame_up_indicated")
        letter_writer_equals_killer = answer.get(
            "letter_writer_equals_killer"
        )

        if not isinstance(trap_is_separate, bool):
            return False

        if not isinstance(frame_up, bool):
            return False

        if not isinstance(letter_writer_equals_killer, bool):
            return False

        return (
            trap_is_separate
            == self.required_analysis["trap_is_separate_evidence"]
            and frame_up
            == self.required_analysis["frame_up_indicated"]
            and letter_writer_equals_killer
            == self.required_analysis["letter_writer_equals_killer"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks