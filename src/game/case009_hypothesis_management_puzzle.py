class Case009HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "coordinated_pattern_supported": True,
            "randomness_explanation_supported": False,
            "intended_meeting_supported": True,
            "other_participant_identified": False,
            "killer_identity_established": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        coordinated_pattern_supported = answer.get(
            "coordinated_pattern_supported"
        )

        randomness_explanation_supported = answer.get(
            "randomness_explanation_supported"
        )

        intended_meeting_supported = answer.get(
            "intended_meeting_supported"
        )

        other_participant_identified = answer.get(
            "other_participant_identified"
        )

        killer_identity_established = answer.get(
            "killer_identity_established"
        )

        if not isinstance(coordinated_pattern_supported, bool):
            return False

        if not isinstance(randomness_explanation_supported, bool):
            return False

        if not isinstance(intended_meeting_supported, bool):
            return False

        if not isinstance(other_participant_identified, bool):
            return False

        if not isinstance(killer_identity_established, bool):
            return False

        return (
            coordinated_pattern_supported
            == self.required_analysis["coordinated_pattern_supported"]
            and randomness_explanation_supported
            == self.required_analysis["randomness_explanation_supported"]
            and intended_meeting_supported
            == self.required_analysis["intended_meeting_supported"]
            and other_participant_identified
            == self.required_analysis["other_participant_identified"]
            and killer_identity_established
            == self.required_analysis["killer_identity_established"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks