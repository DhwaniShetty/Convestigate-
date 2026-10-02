class Case009HypothesisTestPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "planned_route_supported": True,
            "disorientation_explanation_supported": False,
            "robbery_explanation_supported": False,
            "intended_meeting_supported": True,
            "meeting_identity_established": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        planned_route_supported = answer.get(
            "planned_route_supported"
        )

        disorientation_explanation_supported = answer.get(
            "disorientation_explanation_supported"
        )

        robbery_explanation_supported = answer.get(
            "robbery_explanation_supported"
        )

        intended_meeting_supported = answer.get(
            "intended_meeting_supported"
        )

        meeting_identity_established = answer.get(
            "meeting_identity_established"
        )

        if not isinstance(planned_route_supported, bool):
            return False

        if not isinstance(disorientation_explanation_supported, bool):
            return False

        if not isinstance(robbery_explanation_supported, bool):
            return False

        if not isinstance(intended_meeting_supported, bool):
            return False

        if not isinstance(meeting_identity_established, bool):
            return False

        return (
            planned_route_supported
            == self.required_analysis["planned_route_supported"]
            and disorientation_explanation_supported
            == self.required_analysis["disorientation_explanation_supported"]
            and robbery_explanation_supported
            == self.required_analysis["robbery_explanation_supported"]
            and intended_meeting_supported
            == self.required_analysis["intended_meeting_supported"]
            and meeting_identity_established
            == self.required_analysis["meeting_identity_established"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks