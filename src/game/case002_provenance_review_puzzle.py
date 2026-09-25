class Case002ProvenanceReviewPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "independent_storage_evidence_identified": True,
            "arjun_evidence_provenance_questioned": True,
            "second_scene_photos_contradict_official_record": True,
            "original_arjun_narrative_not_fully_reliable": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        independent_storage = answer.get(
            "independent_storage_evidence_identified"
        )

        arjun_provenance = answer.get(
            "arjun_evidence_provenance_questioned"
        )

        photo_contradiction = answer.get(
            "second_scene_photos_contradict_official_record"
        )

        narrative_reliability = answer.get(
            "original_arjun_narrative_not_fully_reliable"
        )

        if not isinstance(independent_storage, bool):
            return False

        if not isinstance(arjun_provenance, bool):
            return False

        if not isinstance(photo_contradiction, bool):
            return False

        if not isinstance(narrative_reliability, bool):
            return False

        return (
            independent_storage
            == self.required_analysis[
                "independent_storage_evidence_identified"
            ]
            and arjun_provenance
            == self.required_analysis[
                "arjun_evidence_provenance_questioned"
            ]
            and photo_contradiction
            == self.required_analysis[
                "second_scene_photos_contradict_official_record"
            ]
            and narrative_reliability
            == self.required_analysis[
                "original_arjun_narrative_not_fully_reliable"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks
