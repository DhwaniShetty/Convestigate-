class PatternMappingPuzzle:
    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "route_is_deliberate": True,
            "valuables_remained_with_blair": True,
            "pattern_is_not_ordinary_tourism": True,
            "robbery_explanation_supported": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        route_is_deliberate = answer.get("route_is_deliberate")
        valuables_remained_with_blair = answer.get(
            "valuables_remained_with_blair"
        )
        pattern_is_not_ordinary_tourism = answer.get(
            "pattern_is_not_ordinary_tourism"
        )
        robbery_explanation_supported = answer.get(
            "robbery_explanation_supported"
        )

        if not isinstance(route_is_deliberate, bool):
            return False

        if not isinstance(valuables_remained_with_blair, bool):
            return False

        if not isinstance(pattern_is_not_ordinary_tourism, bool):
            return False

        if not isinstance(robbery_explanation_supported, bool):
            return False

        return (
            route_is_deliberate
            == self.required_analysis["route_is_deliberate"]
            and valuables_remained_with_blair
            == self.required_analysis["valuables_remained_with_blair"]
            and pattern_is_not_ordinary_tourism
            == self.required_analysis["pattern_is_not_ordinary_tourism"]
            and robbery_explanation_supported
            == self.required_analysis["robbery_explanation_supported"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks