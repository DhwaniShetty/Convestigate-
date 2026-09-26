class Case013RelationshipMappingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_connections = {
            "service_weapon": "department_inventory",
            "pawned_radio": "private_life_contact",
            "schedule_activity_overlap": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        service_weapon = answer.get("service_weapon")
        pawned_radio = answer.get("pawned_radio")
        schedule_activity_overlap = answer.get(
            "schedule_activity_overlap"
        )

        if not isinstance(service_weapon, str):
            return False

        if not isinstance(pawned_radio, str):
            return False

        if not isinstance(schedule_activity_overlap, bool):
            return False

        return (
            service_weapon
            == self.required_connections["service_weapon"]
            and pawned_radio
            == self.required_connections["pawned_radio"]
            and schedule_activity_overlap
            == self.required_connections["schedule_activity_overlap"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks