class Case012MotiveAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "beneficiary_identified": True,
            "fabricated_identity_identified": True,
            "real_participants_identified": True,
            "alias_participant_identified": True,
            "evidence_only_entities_identified": True,
            "benefit_from_death_identified": True
        }

        self.required_hypotheses = {
            "H1": "supported",
            "H2": "contradicted",
            "H3": "unresolved"
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

        hypotheses = answer.get("hypotheses")

        if not isinstance(hypotheses, dict):
            return False

        for hypothesis_id, expected_status in self.required_hypotheses.items():
            actual_status = hypotheses.get(hypothesis_id)

            if actual_status != expected_status:
                return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks
    