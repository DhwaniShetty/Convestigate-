class Case002TimelineAccessMappingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "daniel_timeline_requires_verification": True,
            "vikram_evidence_access_identified": True,
            "access_does_not_prove_murder_involvement": True,
            "investigation_record_compromised": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        daniel_timeline = answer.get(
            "daniel_timeline_requires_verification"
        )

        vikram_access = answer.get(
            "vikram_evidence_access_identified"
        )

        access_not_guilt = answer.get(
            "access_does_not_prove_murder_involvement"
        )

        investigation_compromised = answer.get(
            "investigation_record_compromised"
        )

        if not isinstance(daniel_timeline, bool):
            return False

        if not isinstance(vikram_access, bool):
            return False

        if not isinstance(access_not_guilt, bool):
            return False

        if not isinstance(investigation_compromised, bool):
            return False

        return (
            daniel_timeline
            == self.required_analysis[
                "daniel_timeline_requires_verification"
            ]
            and vikram_access
            == self.required_analysis[
                "vikram_evidence_access_identified"
            ]
            and access_not_guilt
            == self.required_analysis[
                "access_does_not_prove_murder_involvement"
            ]
            and investigation_compromised
            == self.required_analysis[
                "investigation_record_compromised"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks
