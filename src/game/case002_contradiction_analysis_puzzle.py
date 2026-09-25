class Case002ContradictionAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "scene_contradiction_identified": True,
            "chain_of_custody_gap_identified": True,
            "evidence_transfer_discrepancy_identified": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        scene_contradiction = answer.get(
            "scene_contradiction_identified"
        )

        chain_gap = answer.get(
            "chain_of_custody_gap_identified"
        )

        transfer_discrepancy = answer.get(
            "evidence_transfer_discrepancy_identified"
        )

        if not isinstance(scene_contradiction, bool):
            return False

        if not isinstance(chain_gap, bool):
            return False

        if not isinstance(transfer_discrepancy, bool):
            return False

        return (
            scene_contradiction
            == self.required_analysis[
                "scene_contradiction_identified"
            ]
            and chain_gap
            == self.required_analysis[
                "chain_of_custody_gap_identified"
            ]
            and transfer_discrepancy
            == self.required_analysis[
                "evidence_transfer_discrepancy_identified"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks
