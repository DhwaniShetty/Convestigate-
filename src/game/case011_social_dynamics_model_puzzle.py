class Case011SocialDynamicsModelPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "public_panic_identified": True,
            "jazz_response_identified": True,
            "threat_influence_on_behavior_identified": True,
            "attacker_hypothesis_compared": True,
            "letter_writer_hypothesis_compared": True,
            "public_behavior_not_treated_as_attacker_identity_proof": True
        }

        self.required_hypotheses = {
            "H1": "unresolved",
            "H2": "unresolved",
            "H3": "supported"
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
    