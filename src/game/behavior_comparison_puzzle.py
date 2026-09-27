class BehaviorComparisonPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.comparison = puzzle_data.get("observed_vs_narrative", {})
        self.unlocks = puzzle_data.get("unlocks", [])

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        selected_observed = answer.get("directly_observed", [])
        selected_narrative = answer.get("narrative_added_afterward", [])

        expected_observed = self.comparison.get(
            "directly_observed", []
        )

        expected_narrative = self.comparison.get(
            "narrative_added_afterward", []
        )

        return (
            set(selected_observed) == set(expected_observed)
            and
            set(selected_narrative) == set(expected_narrative)
        )

    def get_unlocked_evidence(self):
        return self.unlocks