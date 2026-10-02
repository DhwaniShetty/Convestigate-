class AssetTracingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_answer = {
            "service_weapon_origin": "official_department_inventory",
            "radio_origin": "pawn_records",
            "same_period": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        service_weapon_origin = answer.get("service_weapon_origin")
        radio_origin = answer.get("radio_origin")
        same_period = answer.get("same_period")

        if not isinstance(service_weapon_origin, str):
            return False

        if not isinstance(radio_origin, str):
            return False

        if not isinstance(same_period, bool):
            return False

        return (
            service_weapon_origin
            == self.required_answer["service_weapon_origin"]
            and radio_origin
            == self.required_answer["radio_origin"]
            and same_period
            == self.required_answer["same_period"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks