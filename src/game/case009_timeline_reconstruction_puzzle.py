class Case009TimelineReconstructionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "check_in_establishes_time_window": True,
            "forty_minute_gap_is_unexplained": True,
            "gap_is_significant": True,
            "room_events_are_fully_known": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        check_in_establishes_time_window = answer.get(
            "check_in_establishes_time_window"
        )

        forty_minute_gap_is_unexplained = answer.get(
            "forty_minute_gap_is_unexplained"
        )

        gap_is_significant = answer.get(
            "gap_is_significant"
        )

        room_events_are_fully_known = answer.get(
            "room_events_are_fully_known"
        )

        if not isinstance(check_in_establishes_time_window, bool):
            return False

        if not isinstance(forty_minute_gap_is_unexplained, bool):
            return False

        if not isinstance(gap_is_significant, bool):
            return False

        if not isinstance(room_events_are_fully_known, bool):
            return False

        return (
            check_in_establishes_time_window
            == self.required_analysis["check_in_establishes_time_window"]
            and forty_minute_gap_is_unexplained
            == self.required_analysis["forty_minute_gap_is_unexplained"]
            and gap_is_significant
            == self.required_analysis["gap_is_significant"]
            and room_events_are_fully_known
            == self.required_analysis["room_events_are_fully_known"]
        )

    def get_unlocked_evidence(self):
        return self.unlocks