class Case011SpatialAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "attack_1_location_identified": True,
            "attack_2_location_identified": True,
            "attack_3_location_identified": True,
            "attack_4_location_identified": True,
            "attack_locations_compared": True,
            "victim_relationships_considered": True,
            "spatial_pattern_documented": True
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

        return True

    def get_unlocked_evidence(self):
        return self.unlocks
    