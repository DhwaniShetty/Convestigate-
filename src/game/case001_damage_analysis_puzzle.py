class Case001DamageAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "damage_inconsistent_with_simple_failure": True,
            "sabotage_opportunity_identified": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        damage_inconsistent = answer.get(
            "damage_inconsistent_with_simple_failure"
        )
        sabotage_opportunity = answer.get(
            "sabotage_opportunity_identified"
        )

        if not isinstance(damage_inconsistent, bool):
            return False

        if not isinstance(sabotage_opportunity, bool):
            return False

        return (
            damage_inconsistent
            == self.required_analysis[
                "damage_inconsistent_with_simple_failure"
            ]
            and sabotage_opportunity
            == self.required_analysis[
                "sabotage_opportunity_identified"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks