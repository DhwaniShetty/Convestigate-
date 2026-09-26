class RelationshipMappingPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_knowledge_sources = [
            "Massie",
            "Second Voice (Unidentified)"
        ]

        self.required_single_authorship = False

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        knowledge_sources = answer.get("knowledge_sources", [])
        single_authorship = answer.get("single_authorship")

        if not isinstance(knowledge_sources, list):
            return False

        if not isinstance(single_authorship, bool):
            return False

        return (
            set(knowledge_sources) == set(self.required_knowledge_sources)
            and single_authorship == self.required_single_authorship
        )

    def get_unlocked_evidence(self):
        return self.unlocks