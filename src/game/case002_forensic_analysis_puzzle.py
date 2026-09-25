class Case002ForensicAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "missing_weapon_identified": True,
            "trajectory_challenges_single_attacker": True,
            "multiple_positions_indicated": True,
            "physical_evidence_reliability_questioned": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        missing_weapon = answer.get(
            "missing_weapon_identified"
        )

        trajectory_challenge = answer.get(
            "trajectory_challenges_single_attacker"
        )

        multiple_positions = answer.get(
            "multiple_positions_indicated"
        )

        reliability_questioned = answer.get(
            "physical_evidence_reliability_questioned"
        )

        if not isinstance(missing_weapon, bool):
            return False

        if not isinstance(trajectory_challenge, bool):
            return False

        if not isinstance(multiple_positions, bool):
            return False

        if not isinstance(reliability_questioned, bool):
            return False

        return (
            missing_weapon
            == self.required_analysis[
                "missing_weapon_identified"
            ]
            and trajectory_challenge
            == self.required_analysis[
                "trajectory_challenges_single_attacker"
            ]
            and multiple_positions
            == self.required_analysis[
                "multiple_positions_indicated"
            ]
            and reliability_questioned
            == self.required_analysis[
                "physical_evidence_reliability_questioned"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks
